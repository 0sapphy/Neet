const { EmbedBuilder, bold } = require("discord.js");
const { emoji } = require("../helpers/utils");

/** @param {import('discord.js').ChatInputCommandInteraction} interaction */
module.exports = (interaction) => {
  const { client, member, guild, options } = interaction;

  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName)?.command;
    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL(),
      })
      .setTimestamp();

    if (!command) return;

    if (typeof command.options.member_permissions === "object") {
      if (!member.permissions.has(command.options.member_permissions)) {
        const mapped_permissions = command.options.member_permissions
          .map((i) => `${bold(i)}`)
          .join(", ");

        embed
          .setTitle("Not Enough Permissions")
          .setDescription(
            `${emoji("Xmark")} | **You** don't have enough permissions to use this command.\n\n- You need these permissions: ${mapped_permissions}`,
          )
          .setColor("Orange");

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }

    if (typeof command.options.client_permissions === "object") {
      if (
        !guild.members.me.permissions.has(command.options.client_permissions)
      ) {
        const mapped_permissions = command.options.client_permissions
          .map((i) => `${bold(i)}`)
          .join(", ");

        embed
          .setTitle("Not Enough Permissions")
          .setDescription(
            `${emoji("Xmark")} | **I** don't have enough permissions to execute this command.\n\n- I need these permissions: ${mapped_permissions}`,
          )
          .setColor("Orange");

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }

    if (options.getSubcommandGroup()) {
      require(
        `../commands/${interaction.commandName}/${options.getSubcommandGroup()}/${options.getSubcommand()}`,
      )(interaction);
    } else if (!options.getSubcommandGroup() && options.getSubcommand(false)) {
      require(
        `../commands/${interaction.commandName}/${options.getSubcommand()}`,
      )(interaction);
    } else {
      command.run(interaction);
    }
  }
};
