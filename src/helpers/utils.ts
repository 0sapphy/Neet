import emojis from "../../scripts/dev/emojis.json";
const { formatEmoji } = require("discord.js");
//const { third_party_invite_sources } = require("../../scripts/dev/discord");

export function emoji(name: keyof typeof emojis, raw = false): string {
  const emoji = emojis[name];
  return raw ? emoji : formatEmoji(emoji, emoji.animated);
}

export function checkInviteLink(content: string) {
  /*const discord_invite_regexp =
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
  };*/
}

/**
 * @param {string} links
 */
export function getInviteLinkCodes(links: string[]) {
  const codes = [];

  for (const link of links) {
    codes.push(link.split("/").pop());
  }

  return codes;
}
