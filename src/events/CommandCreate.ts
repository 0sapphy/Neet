/* eslint-disable @typescript-eslint/no-require-imports */
import { EmbedBuilder, Events } from "discord.js";
import { Neet, NeetEvent } from "../../lib";
import { CommandRunType } from "../../lib/Types/enum";
import { writeWarn } from "../helpers/logger";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,

  run: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const client = interaction.client as Neet;

    const context = client.commands.get(interaction.commandName);
    if (!context) return;

    client.emit("ci-debug", `Received command: ${context.data.name}`);

    // Check if the interaction command was ran in a Guild.
    if (interaction.inCachedGuild()) {
      if (context.handler.user_permissions) {
        // Check if interaction member has the required permissions.
        if (
          !interaction.member.permissions.has(
            context.handler.user_permissions.required,
          )
        ) {
          const required_permissions =
            context.handler.user_permissions.required.join(", ");

          return interaction.reply({
            embeds: [
              WarningEmbed(
                "You don't have enough permissions",
                optional<string | undefined, string>(
                  context.handler.user_permissions.message,
                  `You need these permissions to run this command.\n> ${required_permissions}`,
                ),
              ),
            ],
            ephemeral: true,
          });
        }
      }

      if (context.handler.client_permissions) {
        const me = interaction.guild.members.me
          ? interaction.guild.members.me
          : await interaction.guild.members.fetchMe();

        if (!me.permissions.has(context.handler.client_permissions.required)) {
          const required_permissions =
            context.handler.client_permissions.required.join(", ");

          return interaction.reply({
            embeds: [
              WarningEmbed(
                `I don't have enough permissions`,
                optional<string | undefined, string>(
                  context.handler.client_permissions.message,
                  `I need these permissions to execute this command.\n> ${required_permissions}`,
                ),
              ),
            ],
            ephemeral: true,
          });
        }
      }
    }

    if (context.handler.run_type === CommandRunType.HANDLE) {
      client.emit("cl-debug", `Handling ${context.data.name} command.`);

      if (interaction.options.getSubcommandGroup()) {
        (
          await import(
            `../commands/${interaction.commandName}/${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}`
          )
        ).run(interaction);
        return;
      } else if (
        !interaction.options.getSubcommandGroup() &&
        interaction.options.getSubcommand()
      ) {
        (
          await import(
            `../commands/${interaction.commandName}/${interaction.options.getSubcommand()}`
          )
        ).run(interaction);
        return;
      } else {
        (await import(`../commands/${interaction.commandName}`)).run(
          interaction,
        );
        return;
      }
    }

    if (context.handler.run_type === CommandRunType.THIS) {
      if (!context.run) {
        writeWarn(`Missing "run" at command: ${context.data.name}`);
        return;
      }

      client.emit("cl-debug", `Running ${context.data.name} command.`);

      context.run(interaction);
    }
  },
});

function optional<T, TT>(thing: T, _else: TT) {
  return thing ? thing : _else;
}

function WarningEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor("Blurple")
    .setTimestamp();
}
