/** @format */

import fs from "node:fs";
import { ICommand, IPath } from "../lib/types";
import { NeetClient, Bot } from "../lib";
import { ApplicationCommandOptionType } from "discord.js";

export default async function (client: NeetClient) {
	let amount = 0;
	const files = fs.readdirSync("./src/context/ApplicationCommands/");

	for (const file of files) {
		const command: ICommand = await import(`../context/ApplicationCommands/${removePrefix(file)}`);
		const data = command.data;
		const cmd = command.data.toJSON();
		const options = command.options;
		const path: IPath[] = [{ for: data.name, path: `context/commands/${data.name}` }];

		if (cmd.options) {
			for (const option of cmd.options) {
				if (option.type === ApplicationCommandOptionType.Subcommand) {
					if (Array.isArray(path))
						path.push({ for: option.name, path: `context/commands/${data.name}/${option.name}` });
				}

				if (option.type === ApplicationCommandOptionType.SubcommandGroup && option.options) {
					for (const subop of option.options) {
						if (subop.type === ApplicationCommandOptionType.Subcommand) {
							if (Array.isArray(path))
								path.push({
									for: subop.name,
									path: `context/commands/${data.name}/${option.name}/${subop.name}`
								});
						}
					}
				}
			}
		}

		client.commands.set(data.name, { data, options, paths: path });
		amount++;
	}

	Bot.note(`Loaded (${amount}) commands.`);
}

function removePrefix(str: string) {
	return str.replace(".ts", "");
}
