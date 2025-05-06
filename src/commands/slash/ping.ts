import { codeBlock, SlashCommandBuilder } from "discord.js";
import { SlashCommandStructure } from "../../../lib/DiscordJS/types.client";

export default {
	data: new SlashCommandBuilder().setName("ping").setDescription("Ping, Pong!"),
	run(interaction, context) {
		interaction.reply(`${codeBlock(">>>")} Ping: ${context.client.ws.ping / 1000}ms`)
	}
} satisfies SlashCommandStructure;
