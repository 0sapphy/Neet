import { Events } from "discord.js";
import { Neet, NeetEvent } from "../../lib";
import { CommandRunType } from "../../lib/Types/enum";
import { writeWarn } from "../helpers/logger";
import { createWarningEmbed } from "../helpers/utils";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,

  run: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { options } = interaction;
    const client = interaction.client as Neet;

    const context = client.commands.get(interaction.commandName);
    if (!context) return;

    client.emit("ci-debug", `[INTERACTION] >> Command (${context.data.name}).`);

    if (interaction.inCachedGuild()) {
      if (context.handler.user_permissions) {
        if (!interaction.member.permissions.has(context.handler.user_permissions.required)) {
          const requiredPermissions = context.handler.user_permissions.required.join(", ");
          return interaction.reply({ 
            embeds: [createWarningEmbed("You don't have enough permissions", optional<string | undefined, string>(context.handler.user_permissions.message, `You need these permissions to run this command.\n> ${requiredPermissions}`))], 
            ephemeral: true 
          });
        }
      }

      if (context.handler.client_permissions) {
        const me = interaction.guild.members.me
          ? interaction.guild.members.me
          : await interaction.guild.members.fetchMe();

        if (!me.permissions.has(context.handler.client_permissions.required)) {
          const requiredPermissions = context.handler.client_permissions.required.join(", ");
          return interaction.reply({
            embeds: [createWarningEmbed(`I don't have enough permissions`, optional<string | undefined, string>(context.handler.client_permissions.message, `I need these permissions to execute this command.\n> ${requiredPermissions}`))],
            ephemeral: true,
          });
        }
      }
    }

    if (context.handler.run_type === CommandRunType.HANDLE) {
      if (options.getSubcommandGroup()) {
        (await import(`../commands/${interaction.commandName}/${options.getSubcommandGroup()}/${options.getSubcommand()}`))
        .run(interaction);
      } else if (!options.getSubcommandGroup() && options.getSubcommand()) {
        (await import(`../commands/${interaction.commandName}/${options.getSubcommand()}`))
        .run(interaction);
      } else {
        (await import(`../commands/${interaction.commandName}`))
        .run(interaction);
      }
    }

    if (context.handler.run_type === CommandRunType.THIS) {
      if (!context.run) {
        writeWarn(`Missing "run" at command: ${context.data.name}`);
        return;
      }

      context.run(interaction);
    }
  },
});

function optional<T, TT>(thing: T, _else: TT) {
  return thing ? thing : _else;
}