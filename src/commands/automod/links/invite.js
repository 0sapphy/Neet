const {
  EmbedBuilder,
  ActionRowBuilder,
  RoleSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
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

  const WhitelistRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("automod-whitelist")
      .setLabel("Whitelist")
      .setStyle(ButtonStyle.Primary),
  );

  embed
    .setTitle(`Saved Changes`)
    .setDescription(
      `${emoji("Toggle_on")} | Enabled invite link Auto-Moderation`,
    )
    .setColor("Blurple");

  return interaction.editReply({
    embeds: [embed],
    components: [ImuneRoleSelectRow, WhitelistRow],
  });
};
