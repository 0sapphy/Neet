const {
  SlashCommandBuilder,
  EmbedBuilder,
  GuildMember,
} = require("discord.js");
const { writeError } = require("../../helpers/logger");
const { Cases } = require("../../helpers/database");
const { emoji } = require("../../helpers/utils");

module.exports = {
  options: {
    member_permissions: ["BanMembers"],
    client_permissions: ["BanMembers"],
  },

  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Create a ban in this server.")

    .addUserOption((option) => {
      return option
        .setName("user")
        .setDescription("The user to ban.")
        .setRequired(true);
    })

    .addStringOption((option) => {
      return option
        .setName("reason")
        .setDescription("The reason to ban this user.")
        .setRequired(false);
    }),

  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  run: async (interaction) => {
    const { user: int_user, guild, options } = interaction;
    const target = options.getMember("user")
      ? options.getMember("user")
      : options.getUser("user");
    const reason = options.getString("reason") || "No Reason Provided";
    const errors = { success_dm: true, success_ban: true };

    const initialEmbed = new EmbedBuilder()
      .setAuthor({
        name: int_user.username,
        iconURL: int_user.displayAvatarURL(),
      })
      .setTimestamp();

    if (target instanceof GuildMember) {
      if (!target.bannable) {
        initialEmbed
          .setTitle("Not Enough Permissions")
          .setDescription(
            `${emoji("Xmark")} | **I** don't have enough permissions to ban this member.\n\n- Member might have a higher role than me.\n- Check if i have the correct permissions to ban members.${target.id === target.client.user.id ? "\n- **I can't ban myself.**" : ""}`,
          )
          .setColor("Orange");

        return interaction.reply({ embeds: [initialEmbed], ephemeral: true });
      }
    }

    await interaction.deferReply();

    try {
      const DirectMessageEmbed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setTitle(`You were banned from: ${guild.name}`)
        .setDescription(`> **Reason**\n${reason}`)
        .setColor("Red")
        .setTimestamp();

      await guild.bans.create(target, { reason });

      await Cases.createCase(target.id, {
        moderator_id: int_user.id,
        guild_id: guild.id,
        action: "ban",
        reason,
      });

      await target.send({ embeds: [DirectMessageEmbed] });
    } catch (error) {
      writeError("command-ban error", error);

      // If DM was not delivered.
      if (error.rawError.code === 50007) {
        Object.assign(errors, { success_dm: false });
      }

      // If the target was not banned.
      if (error.rawError.code === 500000) {
        Object.assign(errors, { success_ban: false });
      }
    } finally {
      const finalResponseEmbed = new EmbedBuilder()
        .setAuthor({
          name: int_user.username,
          iconURL: int_user.displayAvatarURL(),
        })
        .setFooter({ text: `${target.id}` })
        .setColor("Blurple");

      if (!errors.success_dm) {
        finalResponseEmbed.setFooter({ text: `${target.id} - [NO-DM]` });
      }

      if (!errors.success_ban) {
        finalResponseEmbed.setDescription(
          `${emoji("Xmark")} | Failed to ban ${target}`,
        );
      } else {
        finalResponseEmbed.setDescription(
          `${emoji("Checkmark")} | Banned ${target} | ${reason}`,
        );
      }

      interaction.editReply({ embeds: [finalResponseEmbed] });
    }
  },
};
