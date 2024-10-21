import emojis from "../../scripts/emojis.json";
import {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  formatEmoji,
} from "discord.js";

/* (**GEN: UTILITY FUNCTIONS**) (2024.10.14) */

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

/* (CMD: UTILITY FUNCTIONS) (2024.10.14) */

export function commandUserOnly(
  interaction: ButtonInteraction | ChannelSelectMenuInteraction,
  userId?: string,
) {
  if (!userId) userId = interaction.user.id;

  if (userId === interaction.message.interactionMetadata?.user.id) {
    return false;
  } else {
    if (interaction.deferred) {
      interaction.editReply(
        `${emoji("Xmark")} | You can't use this interaction.`,
      );
      return true;
    }

    interaction.reply({
      content: `${emoji("Xmark")} | You can't use this interaction.`,
      ephemeral: true,
    });

    return true;
  }
}
