/** @format */

import {
	Client,
	type ClientOptions,
	Collection,
	Routes,
	RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import { ICommand } from "./types";

export class NeetClient extends Client {
	public constructor(options: ClientOptions) {
		process.loadEnvFile(".env");
		super(options);
	}

	public commands = new Collection<string, ICommand>();

	private async PUTCommands(commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]) {
		this.rest.setToken(process.env.TOKEN);
		return await this.rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: commands
		});
	}

	public async registerCommands() {
		const data = [];
		for (const command of [...this.commands.values()]) {
			data.push(command.data.toJSON());
		}

		return await this.PUTCommands(data);
	}
}
