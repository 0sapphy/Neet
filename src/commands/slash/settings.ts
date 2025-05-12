import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommandStructure } from "../../../lib/DiscordJS/types.client";

export default {
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Settings command to set-up bot's features in this server.")
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

		.addSubcommand(command => {
			return command.setName("welcome").setDescription("Set-up the welcome system!");
		})
} satisfies SlashCommandStructure;
