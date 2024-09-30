const emojis = require("../../scripts/dev/emojis.json");
const { formatEmoji } = require("discord.js");

/**
 * @param {keyof emojis} name
 */
function emoji(name, raw = false) {
  const emoji = emojis[name];
  return raw ? emoji : formatEmoji(emoji, emoji.animated);
}

/**
 * Check if a string contains a invite link.
 * @param {string} content
 */
function checkInviteLink(content) {
  const discord_invite_regexp =
    /(?:^|\b)discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/(?<code>[\w-]{2,255})(?:$|\b)/gi;

  if (!content.match(discord_invite_regexp)) {
    return { found: false };
  }

  return {
    found: true,
    matches: content.match(discord_invite_regexp),
    codes: getInviteLinkCodes(content.match(discord_invite_regexp)),
  };
}

/**
 * @param {string} links
 */
function getInviteLinkCodes(links) {
  const codes = [];

  for (const link of links) {
    codes.push(link.split("/").pop());
  }

  return codes;
}

module.exports = {
  emoji,
  checkInviteLink,
};
