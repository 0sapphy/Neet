const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  EmbedBuilder,
} = require("discord.js");
const { writeError } = require("../../helpers/logger");
const { Cases } = require("../../helpers/database");

module.exports = {
  options: {
    member_permissions: ["ModerateMembers"],
  },

  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member in this server.")
    .setContexts([InteractionContextType.Guild])
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

    .addUserOption((option) => {
      return option
        .setName("user")
        .setDescription("The target to warn.")
        .setRequired(true);
    })

    .addStringOption((option) => {
      return option
        .setName("reason")
        .setDescription("The reason for warning this member.")
        .setRequired(false);
    }),

  /** @param {import('discord.js').ChatInputCommandInteraction} interaction */
  run: async (interaction) => {
    const { guild, user: Iuser, options } = interaction;

    const member = options.getMember("user");
    const reason = options.getString("reason");

    const embed = new EmbedBuilder()
      .setAuthor({ name: Iuser.username, iconURL: Iuser.displayAvatarURL() })
      .setTimestamp();

    if (!member) {
      const user = options.getUser("user");

      embed
        .setTitle("Member Not Found")
        .setDescription(`**[${user.username}]** User is not in this server.`)
        .setColor("Orange");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (member.id === Iuser.id) {
      embed
        .setTitle("Nah-Uh")
        .setDescription("You cannot warn yourself.")
        .setColor("Blurple");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (member.id === interaction.client.user.id) {
      embed
        .setTitle("Pls!")
        .setDescription("I will not warn myself 👍")
        .setColor("Blurple");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const DirectMessageEmbed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setTitle(`You were warned in ${guild.name}`)
        .setDescription(`> **Reason**\n${reason}`)
        .setColor("Orange")
        .setTimestamp();

      await Cases.createCase(member.id, {
        moderator_id: Iuser.id,
        guild_id: guild.id,
        action: "warn",
        reason,
      });

      await member.send({ embeds: [DirectMessageEmbed] });
    } catch (error) {
      writeError("command-warn error", error);
    } finally {
      const FinalResponseEmbed = new EmbedBuilder()
        .setAuthor({ name: Iuser.username, iconURL: Iuser.displayAvatarURL() })
        .setDescription(`:white_check_mark: | Warned ${member} | ${reason}`)
        .setColor("Blurple")
        .setTimestamp();

      interaction.editReply({ embeds: [FinalResponseEmbed] });
    }
  },
};
