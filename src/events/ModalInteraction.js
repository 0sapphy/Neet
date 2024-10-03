const { Events } = require("discord.js");
const Guilds = require("../models/Guilds");
const { emoji } = require("../helpers/utils");

module.exports.data = {
  name: Events.InteractionCreate,
  once: false,

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  run: async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    const { guild, customId, fields } = interaction;

    // AutoModeration invite whitelist.
    if (customId === "automod-invites_wl") {
      await interaction.deferReply({ ephemeral: true });

      const whitelist = fields.getTextInputValue("automod-invites_wl,ls");
      const value = whitelist ? whitelist.split(",") : null;

      const e = await Guilds.findOneAndUpdate(
        { guildId: guild.id },
        { automod_links_invite: { whitelist: value } },
        { new: true },
      );
      console.log(e);

      interaction.editReply({
        content: `${emoji("Checkmark")} Saved Changes.`,
      });
    }
  },
};
