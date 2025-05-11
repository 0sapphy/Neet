import { Neet } from "../../../lib";
import { EventStructure } from "../../../lib/DiscordJS/types.client";

export default {
	name: "interactionCreate",
	type: "on",
	async run(interaction) {
		if (!interaction.isChatInputCommand()) return;
		const client = interaction.client as Neet<true>;
		const command = client.commands.slash.get(interaction.commandName);

		command?.run(interaction, { client });
	}
} satisfies EventStructure<"interactionCreate">;
