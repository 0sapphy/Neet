const {
  EmbedBuilder,
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { createOgetData } = require("../../../helpers/database");
const Guilds = require("../../../models/Guilds");
const { emoji } = require("../../../helpers/utils");

/** @param {import('discord.js').ChatInputCommandInteraction} interaction */
module.exports = async (interaction) => {
  const { guild, user: Iuser, options } = interaction;
  await interaction.deferReply();

  const enabled = options.getBoolean("enabled", true);
  const res = await createOgetData(Guilds, { guildId: guild.id });
  const embed = new EmbedBuilder()
    .setAuthor({ name: Iuser.username, iconURL: Iuser.displayAvatarURL() })
    .setTimestamp();

  if (!enabled) {
    res.data.automod_links_invite.enabled = false;
    res.data.automod_links_invite.whitelist = null;
    await res.data.save();

    embed
      .setTitle(`Saved Changes`)
      .setDescription(
        `${emoji("Toggle_OFF")} | Disabled invite link Auto-Moderation.`,
      )
      .setColor("Blurple");

    return interaction.editReply({ embeds: [embed] });
  }

  res.data.automod_links_invite.enabled = true;
  await res.data.save();

  const ImuneRoleSelectMenu = new RoleSelectMenuBuilder()
    .setPlaceholder("Select a imune role!")
    .setCustomId("automod-invitelink")
    .setMaxValues(5);

  res.data.automod_links_invite.imune_roles
    ? ImuneRoleSelectMenu.addDefaultRoles(
        res.data.automod_links_invite.imune_roles,
      )
    : null;

  const ImuneRoleSelectRow = new ActionRowBuilder().addComponents(
    ImuneRoleSelectMenu,
  );

  const WhitelistModal = new ModalBuilder()
    .setCustomId("automod-invites_wl")
    .setTitle("Auto-Moderation Invites Whitelist");

  const WhitelistTextInput = new TextInputBuilder()
    .setCustomId("automod-invites_wl,ls")
    .setLabel("Whitelist")
    .setStyle(TextInputStyle.Short);

  res.data.automod_links_invite.whitelist
    ? WhitelistTextInput.setValue(
        res.data.automod_links_invite.whitelist.map((i) => i).join(", "),
      )
    : null;

  const WhitelistRow = new ActionRowBuilder().addComponents(
    WhitelistModal.addComponents(WhitelistTextInput),
  );

  embed
    .setTitle(`Saved Changes`)
    .setDescription(
      `${emoji("Toggle_on")} | Enabled invite link Auto-Moderation`,
    )
    .setColor("Blurple");

  return interaction.editReply({
    embeds: [embed],
    components: [ImuneRoleSelectRow],
  });
};
