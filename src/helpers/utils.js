const emojis = require("../../scripts/dev/emojis.json");
const { formatEmoji } = require("discord.js");
const { third_party_invite_sources } = require("../../scripts/dev/discord");

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

  const match = content.match(discord_invite_regexp);

  // if no matches found using the above RegExp, check for third party links.
  if (!match) {
    for (const source of third_party_invite_sources) {
      const thirdparty_match = content.match(source.regexp);

      // if match, return.
      if (thirdparty_match) {
        return {
          found: true,
          matches: thirdparty_match,
          codes: getInviteLinkCodes(thirdparty_match),
        };
      }
    }

    return {
      found: false,
    };
  }

  return {
    found: true,
    matches: match,
    codes: getInviteLinkCodes(match),
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
