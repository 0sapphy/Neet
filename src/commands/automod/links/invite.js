const { EmbedBuilder } = require("discord.js");
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

  embed
    .setTitle(`${emoji("Checkmark")} Saved Changes.`)
    .setDescription(
      `${emoji("Toggle_on")} | Enabled invite link automoderation`,
    )
    .setColor("Blurple");

  if (whitelist) {
    embed.data.description += `\n\n- Whitelist: ${whitelist
      .split("|")
      .map((i) => i)
      .join(", ")}`;
  }

  return interaction.editReply({ embeds: [embed] });
};
