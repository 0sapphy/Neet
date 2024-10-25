import emojis from "../../icons.json";
import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ColorResolvable,
  EmbedBuilder,
  formatEmoji,
  ModalSubmitInteraction,
} from "discord.js";

/* (**UTILITY FUNCTIONS**) (2024.10.22) */

/**
 * Get an emoji from emojis.json.
 * Returns a string or an ApplicationEmoji Object.
 */
export function emoji(
  name: string,
  raw = false,
): string | typeof emoji {
  const emoji = emojis.find(E => E.name === name);
  return raw ? emoji : formatEmoji(emoji!.id, emoji!.animated);
}

/**
 * Reverse a boolean
 */
export function reverse(V: boolean | undefined | null): boolean {
  return V ? false : true;
}

/**
 * Turn a boolean into an Enable(d) / Disable(d) string
 */
export function status(
  V: boolean | null | undefined,
  component?: boolean,
): string {
  if (component) return V ? "Disable" : "Enable";
  return V ? "Enabled" : "Disabled";
}

/* (COMMAND UTILITY FUNCTIONS) (2024.10.22) */

/**
 * Check if the interaction.user / userId equals to the original command user.
 * Returns false if its not the original user.
 */
export function isCommandUser(
  int: ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction,
  userId?: string,
) {
  if (userId === undefined) userId = int.user.id;
  if (int.message?.interactionMetadata?.user.id === userId) return true;

  const payload = {
    embeds: [
      createWarningEmbed(
        `${emoji("Xmark")} You can't use this interaction`,
        "Hiya, this interaction is not for you!",
        "Random",
      ),
    ],
  };

  if (int.deferred) int.editReply(payload);
  else int.reply(Object.assign(payload, { ephemeral: true }));

  return false;
}

export function createWarningEmbed(
  title: string,
  description: string,
  color?: ColorResolvable,
) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color ?? "Orange")
    .setTimestamp();
}
