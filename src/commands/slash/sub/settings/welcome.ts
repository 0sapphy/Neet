import { ChatInputCommandInteraction } from "discord.js";

export function execute(interaction: ChatInputCommandInteraction) {
	interaction.reply("Base...");
	return;
}
