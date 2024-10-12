import emojis from "../../scripts/dev/emojis.json";
import { formatEmoji } from "discord.js";

export function emoji(
  name: keyof typeof emojis,
  raw = false,
): string | typeof emoji {
  const emoji = emojis[name];
  return raw ? emoji : formatEmoji(emoji.id, emoji.animated);
}

export function reverse(V: boolean | undefined | null): boolean {
  return V ? false : true;
}

export function status(
  V: boolean | null | undefined,
  component?: boolean,
): string {
  if (component) return V ? "Disable" : "Enable";
  return V ? "Enabled" : "Disabled";
}
