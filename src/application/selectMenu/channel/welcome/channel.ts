import {
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  channelMention,
  ChannelSelectMenuInteraction,
  EmbedBuilder,
  APIChannelSelectComponent,
  ButtonBuilder,
  APIButtonComponent,
} from "discord.js";
import { updateWelcome } from "../../../../helpers/database";
import { emoji, reverse, status } from "../../../../helpers/utils";

export async function run(interaction: ChannelSelectMenuInteraction<"cached">) {
  const {
    guildId,
    values,
    message: { embeds, components },
  } = interaction;
  await interaction.deferReply({ ephemeral: true });

  const channelId = values[0];
  const data = await updateWelcome(guildId, { channelId });

  const embed = EmbedBuilder.from(embeds[0])
    .setDescription(
      `**»** **Status »»»** ${status(data?.enabled)}\n**»** **Channel »»»** ${data?.channelId ? channelMention(data.channelId) : "None"}`,
    )
    .setColor(data?.enabled ? "Blurple" : "Orange");

  const channelSelect = ActionRowBuilder.from(components[0]).setComponents(
    ChannelSelectMenuBuilder.from(
      components[0].components[0] as unknown as APIChannelSelectComponent,
    )
      .setDisabled(reverse(data?.enabled))
      .addDefaultChannels([channelId]),
  ) as ActionRowBuilder<ChannelSelectMenuBuilder>;

  const statusButton = ActionRowBuilder.from(components[1]).setComponents(
    ButtonBuilder.from(components[1].components[0] as APIButtonComponent),
  ) as ActionRowBuilder<ButtonBuilder>;

  await interaction.message.edit({
    embeds: [embed],
    components: [channelSelect, statusButton],
  });

  return await interaction.editReply(`${emoji("Checkmark")} | Saved Settings!`);
}
