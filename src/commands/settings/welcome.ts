import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  channelMention,
  ChannelSelectMenuBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Setting } from "../../models/Settings";
import { reverse, status } from "../../helpers/utils";
import { createId } from "../../../lib";

export async function run(interaction: ChatInputCommandInteraction<"cached">) {
  const { guildId, guild } = interaction;
  await interaction.deferReply();

  const data = (await Setting.GetOrCreate(guildId)).welcome;

  const embed = new EmbedBuilder()
    .setAuthor({ name: guild.name, iconURL: guild.iconURL()! })
    .setTitle("Configure Welcome Settings")
    .setDescription(`**»** **Status »»»** ${status(data?.enabled)}\n**»** **Channel »»»** ${data?.channelId ? channelMention(data.channelId) : "None"}`)
    .setColor("Blurple")
    .setTimestamp();

  const channelSelect =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId(createId("settings", "welcome"))
        .setChannelTypes([ChannelType.GuildText])
        .setMaxValues(1)
        .setDisabled(reverse(data?.enabled)),
    );

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createId("setting", "welcome", [{ K: "to", V: reverse(data?.enabled) }]))
      .setLabel(status(data?.enabled, true))
      .setStyle(data?.enabled ? ButtonStyle.Danger : ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(createId("settings", "message", [{ K: "for", V: "welcome" }]))
      .setLabel("Message Options")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(reverse(data?.enabled)),
  );

  return await interaction.editReply({
    embeds: [embed],
    components: [channelSelect, buttons],
  });
}
