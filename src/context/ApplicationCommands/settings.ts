/** @format */

import { InteractionContextType, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { ICommandOptions, PermissionTypes } from "../../lib/types";

export const data = new SlashCommandBuilder()
	.setName("settings")
	.setDescription("Configure bot settings for this server.")
	.setContexts(InteractionContextType.Guild)
	.addSubcommand(command => {
		return command.setName("view").setDescription("View the settings for this server.");
	});

export const options: ICommandOptions = {
	permissions: [
		{
			type: PermissionTypes.Subcommand,
			context: "view",
			member: [PermissionFlagsBits.ManageMessages]
		}
	]
};
