/**
 * CHANGE THE STATUS FOR "settings.welcome"
 */

import {
  ActionRowBuilder,
  APIButtonComponent,
  APIChannelSelectComponent,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  channelMention,
  ChannelSelectMenuBuilder,
  EmbedBuilder,
} from "discord.js";
import { Arguments, componentGetBoolean, customId } from "../../../../lib";
import {
  commandUserOnly,
  emoji,
  reverse,
  status as Status,
} from "../../../helpers/utils";
import { Setting } from "../../../models/Settings";

export async function run(
  interaction: ButtonInteraction<"cached">,
  parameters: Arguments[],
) {
  if (commandUserOnly(interaction)) return;

  const {
    guildId,
    message: { embeds, components },
  } = interaction;
  await interaction.deferReply({ ephemeral: true });

  const status = componentGetBoolean(parameters, "to");
  if (status === null) return;

  const data = await Setting.UPDATEWelcome(
    guildId,
    status
      ? {
          enabled: status,
        }
      : { enabled: status, channelId: null },
  );

  const embed = EmbedBuilder.from(embeds[0])
    .setDescription(
      `**»** **Status »»»** ${Status(status)}\n**»** **Channel »»»** ${data?.channelId ? channelMention(data.channelId) : "None"}`,
    )
    .setColor(data?.enabled ? "Blurple" : "Orange");

  const channelSelect = ActionRowBuilder.from(components[0]).setComponents(
    ChannelSelectMenuBuilder.from(
      components[0].components[0] as unknown as APIChannelSelectComponent,
    ).setDisabled(reverse(status)),
  ) as ActionRowBuilder<ChannelSelectMenuBuilder>;

  const buttonId = customId("settings", "welcome", [
    { name: "to", value: reverse(data?.enabled) },
  ]);

  const settingButtons = ActionRowBuilder.from(components[1]).setComponents(
    ButtonBuilder.from(components[1].components[0] as APIButtonComponent)
      .setCustomId(buttonId)
      .setLabel(Status(status, true))
      .setStyle(status ? ButtonStyle.Danger : ButtonStyle.Success),

    ButtonBuilder.from(
      components[1].components[1] as APIButtonComponent,
    ).setDisabled(reverse(data?.enabled)),
  ) as ActionRowBuilder<ButtonBuilder>;

  await interaction.message.edit({
    embeds: [embed],
    components: [channelSelect, settingButtons],
  });

  return await interaction.editReply(`${emoji("Checkmark")} | Saved Settings!`);
}
