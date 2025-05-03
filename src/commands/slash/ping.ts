import { SlashCommandBuilder } from "discord.js";
import { SlashCommandStructure } from "../../../lib/DiscordJS/types.client";

export default {
	data: new SlashCommandBuilder().setName("ping").setDescription("Ping, Pong!"),
	run(context) {
		return context;
	}
} satisfies SlashCommandStructure;
