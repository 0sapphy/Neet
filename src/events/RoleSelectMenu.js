const { Events } = require("discord.js");
const { createOgetData } = require("../helpers/database");
const Guilds = require("../models/Guilds");
const { emoji } = require("../helpers/utils");

module.exports.data = {
  name: Events.InteractionCreate,
  once: false,

  /**
   * @param {import('discord.js').RoleSelectMenuInteraction} interaction
   */
  run: async (interaction) => {
    if (!interaction.isRoleSelectMenu()) return;
    const { guild, customId, values } = interaction;

    if (customId === "automod-invitelink") {
      await interaction.deferReply({ ephemeral: true });
      const guildSettings = await createOgetData(Guilds, { guildId: guild.id });
      if (
        guildSettings.error ||
        !guildSettings.data.automod_links_invite.enabled
      )
        return;

      console.log(values);
      guildSettings.data.automod_links_invite.imune_roles = values;
      await guildSettings.data.save();

      await interaction.message.edit({ components: [] }).catch(() => null);
      return interaction.editReply({
        content: `${emoji("Checkmark")} | Updated imune roles!`,
      });
    }
  },
};
