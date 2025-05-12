/** @format */

import fs from "node:fs";
import {
	Client,
	ClientOptions,
	Collection,
	GatewayIntentBits,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	RESTPutAPIApplicationCommandsResult,
	Routes
} from "discord.js";
import { logger, Validator } from "../";
import { EventStructure, MessageCommandStructure, SlashCommandStructure } from "./types.client";

export class Neet<Ready extends boolean = false> extends Client<Ready> {
	public logger = logger;
	public validator = new Validator();

	public constructor(options?: ClientOptions) {
		super({
			...options,
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
		});

		this.validator.parseEnv();
	}

	public commands = {
		messages: new Collection<string, MessageCommandStructure>(),
		slash: new Collection<string, SlashCommandStructure>()
	};

	private handleCommands() {
		this.logger.debug("Attempting to read message command files.");

		// Read the messages folder.
		fs.readdirSync("./src/commands/message/").forEach(async k => {
			try {
				const stat = fs.statSync(`./src/commands/message/${k}`);

				if (stat.isDirectory()) {
					const files = fs.readdirSync(`./src/commands/message/${k}/`);

					for (const file of files) {
						const FIF = fs.statSync(`./src/commands/message/${k}/${file}`);

						if (FIF.isFile()) {
							const command = (await import(`../../src/commands/message/${k}/${file.replace(".ts", "")}`))
								.default as MessageCommandStructure;
							this.commands.messages.set(command.name, command);
							this.logger.debug(`Loaded message-${command.name} from message/${k}/${file}`);
						}
					}
				}

				if (stat.isFile()) {
					const command = (await import(`../../src/commands/message/${k.replace(".ts", "")}`))
						.default as MessageCommandStructure;
					this.commands.messages.set(command.name, command);
					this.logger.debug(`Loaded message-${command.name} from message/${k}`);
				}
			} catch (error) {
				this.logger.error("Commands", error);
			}
		});

		this.logger.debug("Attempting to read slash command files.");

		fs.readdirSync("./src/commands/slash/").forEach(async k => {
			try {
				const stat = fs.statSync(`./src/commands/slash/${k}`);

				if (stat.isDirectory()) {
					const files = fs.readdirSync(`./src/commands/slash/${k}/`).filter(v => v === "sub");

					for (const file of files) {
						const FIF = fs.statSync(`./src/commands/slash/${k}/${file}`);

						if (FIF.isFile()) {
							const command = (await import(`../../src/commands/slash/${k}/${file.replace(".ts", "")}`))
								.default as SlashCommandStructure;
							this.commands.slash.set(command.data.name, command);
							this.logger.debug(`Loaded slash-${command.data.name} from slash/${k}/${file}`);
						}
					}
				}

				if (stat.isFile()) {
					const command = (await import(`../../src/commands/slash/${k.replace(".ts", "")}`))
						.default as SlashCommandStructure;
					this.commands.slash.set(command.data.name, command);
					this.logger.debug(`Loaded slash-${command.data.name} from slash/${k}`);
				}
			} catch (error) {
				this.logger.error(error);
			}
		});
	}

	private handleEvents() {
		this.logger.debug("Attempting to read event files.");

		fs.readdirSync("./src/events/").forEach(async k => {
			try {
				this.logger.debug(`Checking type of ${k}`);
				const stat = fs.statSync(`./src/events/${k}`);

				if (stat.isDirectory()) {
					this.logger.debug(`Loading ./src/events/${k}/*`);

					const files = fs.readdirSync(`./src/events/${k}/`);

					for (const file of files) {
						const event = (await import(`../../src/events/${k}/${file.replace(".ts", "")}`))
							.default as EventStructure;
						this.logger.debug(`Loading /${k}/${file} | ${stat.size.toString()}`);
						this[event.type](event.name, (...args) => event.run(...args));
					}
				}

				if (stat.isFile()) {
					const event = (await import(`../../src/events/${k.replace(".ts", "")}`)).default as EventStructure;
					this.logger.debug(`Loaded ${k} | ${stat.size.toString()}`);
					this[event.type](event.name, (...args) => event.run(...args));
				}
			} catch (error) {
				this.logger.error(error);
			}
		});
	}

	public async deployCommands() {
		this.logger.debug("Attempting to register commands to Discord.");

		try {
			this.rest.setToken(process.env.TOKEN);

			const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
			this.commands.slash.forEach(value => commands.push(value.data.toJSON()));

			const data = (await this.rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
				body: commands
			})) as RESTPutAPIApplicationCommandsResult;

			this.logger.info(`Registered ${data.length} commands to Discord.`);
		} catch (error) {
			this.logger.error(error);
		}
	}

	public begin() {
		try {
			this.handleEvents();
			this.handleCommands();

			this.logger.debug("Attempting to login to Discord.");

			this.login(process.env.TOKEN);

			this.logger.info(`Logged in`);
		} catch (error) {
			this.logger.error(error);
		}
	}
}
