import { Neet } from "../../../lib";
import { EventStructure } from "../../../lib/DiscordJS/types.client";

export default {
	name: "interactionCreate",
	type: "on",
	async run(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const client = interaction.client as Neet<true>;
		const command = client.commands.slash.get(interaction.commandName);

		if (!command) {
			client.logger.warn(`Interaction (${interaction.commandName}) not found.`);
			return;
		}

		if (interaction.options.getSubcommand()) {
			const sub = await import(
				`../../commands/slash/sub/${interaction.commandName}/${interaction.options.getSubcommand()}`
			);
			sub.execute(interaction, { client });
		} else {
			if (!command.run) {
				client.logger.warn(`Interaction (${interaction.commandName}) does not have a run function.`);
				return;
			}

			return command.run(interaction, { client });
		}
	}
} satisfies EventStructure<"interactionCreate">;
