import emojis from "../../scripts/dev/emojis.json";
import discord from "../../scripts/dev/discord";
import { formatEmoji } from "discord.js";

interface InviteLink {
  matched: boolean;
  codes: string[];
}

export function emoji(
  name: keyof typeof emojis,
  raw = false,
): string | typeof emoji {
  const emoji = emojis[name];
  return raw ? emoji : formatEmoji(emoji.id, emoji.animated);
}

export function searchInviteLinks(content: string) {
  const official = content.match(discord.official);
}

export function getInviteLinkCodes(links: string[]) {}
