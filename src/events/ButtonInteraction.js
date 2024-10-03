const {
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const { createOgetData } = require("../helpers/database");
const Guilds = require("../models/Guilds");

module.exports.data = {
  name: Events.InteractionCreate,
  once: false,

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  run: async (interaction) => {
    if (!interaction.isButton()) return;
    const { customId, guild } = interaction;

    if (customId === "automod-whitelist") {
      const res = await createOgetData(Guilds, { guildId: guild.id });

      const WhitelistModal = new ModalBuilder()
        .setCustomId("automod-invites_wl")
        .setTitle("Auto-Moderation Invites Whitelist");

      const WhitelistTextInput = new TextInputBuilder()
        .setCustomId("automod-invites_wl,ls")
        .setLabel("Whitelist (seperated by: | or ,)")
        .setStyle(TextInputStyle.Short);

      res.data.automod_links_invite.whitelist
        ? WhitelistTextInput.setValue(
            res.data.automod_links_invite.whitelist.map((i) => i).join(", "),
          )
        : null;

      const WhitelistRow = WhitelistModal.addComponents(
        new ActionRowBuilder().addComponents(WhitelistTextInput),
      );

      return await interaction.showModal(WhitelistRow);
    }
  },
};
