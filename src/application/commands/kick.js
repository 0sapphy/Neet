const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { writeError, writeInfo } = require("../../helpers/logger");
const { Cases } = require("../../helpers/database");

module.exports = {
  options: {
    member_permissions: ["KickMembers"],
    client_permissions: ["KickMembers", "ModerateMembers"],
  },

  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from this server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)

    .addUserOption((option) => {
      return option
        .setName("member")
        .setDescription("The member to kick.")
        .setRequired(true);
    })

    .addStringOption((option) => {
      return option
        .setName("reason")
        .setDescription("The reason to kick this member.")
        .setRequired(false);
    }),

  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  run: async (interaction) => {
    const { user, guild, options } = interaction;
    const member = options.getMember("member");
    const reason = options.getString("reason") || "No Reason Provided";
    const errors = { success_dm: true };

    const initialEmbed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTimestamp();

    if (!member) {
      const user = options.getUser("member", true);

      initialEmbed
        .setTitle("Member Not Found")
        .setDescription(`[**${user.username}**]: User is not in this server.`)
        .setColor("Blurple");

      return interaction.reply({ embeds: [initialEmbed], ephemeral: true });
    }

    if (!member.kickable) {
      initialEmbed
        .setTitle("Not Enough Permissions")
        .setDescription(
          `**I** don't have enough permissions to kick this member.\n\n- Member might have a higher role than me.\n- Check if i have the correct permissions to kick members.${member.id === member.client.user.id ? "\n- **I cannot kick myself.**" : ""}`,
        )
        .setColor("Orange");

      return interaction.reply({ embeds: [initialEmbed], ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const DirectMessageEmbed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setTitle(`You were kicked from: ${guild.name}`)
        .setDescription(`> **Reason**\n${reason}`)
        .setColor("Orange")
        .setTimestamp();

      await member.kick(reason);

      await Cases.createCase(member.id, {
        guild_id: guild.id,
        moderator_id: user.id,
        action: "kick",
        reason,
      });

      await member.send({ embeds: [DirectMessageEmbed] });
    } catch (error) {
      writeError("command-kick error", error);

      // Could not send DM message....
      if (error.rawError.code === 50007) {
        writeInfo("^ Failed Direct message.");
        Object.assign(errors, { success_dm: false });
      }
    } finally {
      const finalResponseEmbed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .setDescription(`:white_check_mark: | Kicked ${member} | ${reason}`)
        .setFooter({ text: `${member.id}` })
        .setColor("Blurple")
        .setTimestamp();

      if (!errors.success_dm) {
        finalResponseEmbed.setFooter({ text: `${member.id} - [NO-DM]` });
      }

      interaction.editReply({ embeds: [finalResponseEmbed] });
    }
  },
};
