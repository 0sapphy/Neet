const {
  EmbedBuilder,
  ActionRowBuilder,
  RoleSelectMenuBuilder,
} = require("discord.js");
const { createOgetData } = require("../../../helpers/database");
const Guilds = require("../../../models/Guilds");
const { emoji } = require("../../../helpers/utils");

/** @param {import('discord.js').ChatInputCommandInteraction} interaction */
module.exports = async (interaction) => {
  const { guild, user: Iuser, options } = interaction;
  await interaction.deferReply();

  const enabled = options.getBoolean("enabled", true);
  const whitelist = options.getString("white_list");
  const res = await createOgetData(Guilds, { guildId: guild.id });
  const embed = new EmbedBuilder()
    .setAuthor({ name: Iuser.username, iconURL: Iuser.displayAvatarURL() })
    .setTimestamp();

  if (!enabled) {
    res.data.automod_links_invite.enabled = false;
    res.data.automod_links_invite.whitelist = null;
    await res.data.save();

    embed
      .setTitle(`${emoji("Checkmark")} Saved Changes.`)
      .setDescription(
        `${emoji("Toggle_OFF")} | Disabled invite link automoderation.`,
      )
      .setColor("Blurple");

    return interaction.editReply({ embeds: [embed] });
  }

  res.data.automod_links_invite.enabled = true;
  res.data.automod_links_invite.whitelist = whitelist
    ? whitelist.split("|")
    : [];
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

  embed
    .setTitle(`${emoji("Checkmark")} Saved Changes.`)
    .setDescription(
      `${emoji("Toggle_on")} | Enabled invite link Auto-Moderation`,
    )
    .setColor("Blurple");

  if (whitelist) {
    embed.data.description += `\n\n- Whitelist: ${whitelist
      .split("|")
      .map((i) => i)
      .join(", ")}`;
  }

  return interaction.editReply({
    embeds: [embed],
    components: [ImuneRoleSelectRow],
  });
};
