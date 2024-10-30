/** @format */

import { ChatInputCommandInteraction } from "discord.js";
import { ICommandOptions, IPermissions, PermissionTypes } from "../../lib/types";
import { Embed, Permission } from "../../helpers";

export function CommandOptionsHandler(interaction: ChatInputCommandInteraction<"cached">, options: ICommandOptions) {
	const op = interaction.options;
	const { guild, member } = interaction;

	if (op.getSubcommandGroup()) {
		const permissionsForGroup = options.permissions?.find(
			(permissions: IPermissions) =>
				permissions.type === PermissionTypes.Group && permissions.context === op.getSubcommandGroup(true)
		);

		if (permissionsForGroup) {
			const permissionsForSubcommand = permissionsForGroup.items?.find(item => item.name === op.getSubcommand());

			if (permissionsForSubcommand) {
				if (
					permissionsForSubcommand.client &&
					!guild.members.me?.permissions.has(permissionsForSubcommand.client)
				) {
					return interaction.reply({
						ephemeral: true,
						embeds: [
							Embed.permissionsWarning(Permission.bitFieldToString(permissionsForSubcommand.client), {
								prefix: "I"
							})
						]
					});
				}

				if (permissionsForSubcommand.member && !member.permissions.has(permissionsForSubcommand.member)) {
					return interaction.reply({
						ephemeral: true,
						embeds: [Embed.permissionsWarning(Permission.bitFieldToString(permissionsForSubcommand.member))]
					});
				}
			} // if (permissionsForSubcommand)
		} // if (permissionsForGroup)
	} /* if (getSubcommandGroup) */ else if (!op.getSubcommandGroup() && op.getSubcommand()) {
		const permissionsForSubcommand = options.permissions?.find(
			permissions => permissions.type === PermissionTypes.Subcommand && permissions.context === op.getSubcommand()
		);

		if (permissionsForSubcommand) {
			if (
				permissionsForSubcommand.client &&
				!guild.members.me?.permissions.has(permissionsForSubcommand.client)
			) {
				return interaction.reply({
					ephemeral: true,
					embeds: [
						Embed.permissionsWarning(Permission.bitFieldToString(permissionsForSubcommand.client), {
							prefix: "I"
						})
					]
				});
			}

			if (permissionsForSubcommand.member && !member.permissions.has(permissionsForSubcommand.member)) {
				return interaction.reply({
					ephemeral: true,
					embeds: [Embed.permissionsWarning(Permission.bitFieldToString(permissionsForSubcommand.member))]
				});
			}
		} // if (permissionsForSubcommand)
	} /* if (!getSubcommandGroup && getSubcommand) */ else {
		const permissionsForCommand = options.permissions?.find(
			permissions => permissions.type === PermissionTypes.Command
		);

		if (permissionsForCommand) {
			if (permissionsForCommand.client && !guild.members.me?.permissions.has(permissionsForCommand.client)) {
				return interaction.reply({
					ephemeral: true,
					embeds: [
						Embed.permissionsWarning(Permission.bitFieldToString(permissionsForCommand.client), {
							prefix: "I"
						})
					]
				});
			}

			if (permissionsForCommand.member && !member.permissions.has(permissionsForCommand.member)) {
				return interaction.reply({
					ephemeral: true,
					embeds: [Embed.permissionsWarning(Permission.bitFieldToString(permissionsForCommand.member))]
				});
			}
		} // if (permissionsForCommand)
	} // else
}
