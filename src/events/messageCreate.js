const { EmbedBuilder } = require("discord.js");
const { createOgetData, Cases } = require("../helpers/database");
const { writeError } = require("../helpers/logger");
const { checkInviteLink } = require("../helpers/utils");
const Guilds = require("../models/Guilds");

/**
 * @param {import('discord.js').Message<true>} message
 */
module.exports = async (message) => {
  if (checkInviteLink(message.content).found) {
    moderateInviteLink(message);
  }
};

/**
 * @param {import('discord.js').Message<true>} message
 */
async function moderateInviteLink(message) {
  const { member, guild } = message;
  //if (member.permissions.has('ManageGuild')) return;

  const guild_settings = await createOgetData(Guilds, { guildId: guild.id });

  if (guild_settings.error || !guild_settings.data.automod_links_invite.enabled)
    return;

  const res = checkInviteLink(message.content);

  if (
    guild_settings.data.automod_links_invite.whitelist.length > 0 &&
    guild_settings.data.automod_links_invite.whitelist.includes(res.codes)
  )
    return;

  try {
    const DirectMessageEmbed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setTitle("[Auto-Moderation]: Invite Links")
      .setDescription(`Please refrain from sending invite links.`)
      .setColor("Orange")
      .setTimestamp();

    if (guild_settings.data.automod_links_invite.action === "warn") {
      let cant_send_warn = false;

      await member.send({ embeds: [DirectMessageEmbed] }).catch(() => {
        cant_send_warn = true;
      });

      await Cases.createCase(member.id, {
        guild_id: guild.id,
        moderator_id: message.client.user.id,
        action: "warn",
        reason: `[Auto-Moderation]: Sent an invite link to: ${message.channel.name}`,
      });

      if (cant_send_warn) {
        await message.channel
          .send({
            content: member.toString(),
            embeds: [DirectMessageEmbed],
          })
          .catch((_err) =>
            writeError("automoderation-channel-send Error", _err),
          );
      }
    } else if (guild_settings.data.automod_links_invite.action === "kick") {
      await member
        .send({ embeds: [DirectMessageEmbed] })
        .catch((_err) => writeError("automoderation-dm-send", _err));

      await member.kick(`[Auto-Moderation]: Invite Link Detacted.`);
      await Cases.createCase(member.id, {
        guild_id: guild.id,
        moderator_id: message.client.user.id,
        action: "kick",
        reason: `[Auto-Moderation]: Sent an invite link to: ${message.channel.name}`,
      });
    } else if (guild_settings.data.automod_links_invite.action === "ban") {
      await member
        .send({ embeds: [DirectMessageEmbed] })
        .catch((_err) => writeError("automoderation-dm-send", _err));

      await guild.bans.create(member, {
        reason: `[Auto-Moderation]: Invite Link Detacted.`,
      });

      await Cases.createCase(member.id, {
        guild_id: guild.id,
        moderator_id: message.client.user.id,
        action: "ban",
        reason: `[Auto-Moderation]: Sent an invite link to ${message.channel.name}`,
      });
    }

    await message.delete();
  } catch (error) {
    writeError("automod-invite_links Error", error);
  }
}
