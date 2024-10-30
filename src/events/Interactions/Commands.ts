/** @format */

import { Interaction, Events } from "discord.js";
import { NeetClient } from "../../lib";
import { CommandOptionsHandler } from "../../handlers/Interactions/CommandOptions";

export default {
	name: Events.InteractionCreate,
	once: false,
	run: async (interaction: Interaction) => {
		if (!interaction.isChatInputCommand()) return;
		const client = interaction.client as NeetClient;
		const { options } = interaction;
		const command = client.commands.get(interaction.commandName);

		if (interaction.inCachedGuild() && command?.options) {
			CommandOptionsHandler(interaction, command.options);
		}

		let path = command?.paths.find(path => path.for === options.getSubcommand());
		if (!path) path = command?.paths.find(path => path.for === interaction.commandName);

		if (path) {
			(await import(`../../${path.path}`)).run(interaction);
		}
	}
};
