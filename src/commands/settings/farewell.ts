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
import { NeetButton } from "../../../lib";

export async function run(interaction: ChatInputCommandInteraction<"cached">) {
  const { guildId, guild } = interaction;
  await interaction.deferReply();

  let data;
  data = await Setting.findOne({ guildId });
  if (!data) {
    data = await Setting.create({ guildId });
    await data.save();
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: guild.name, iconURL: guild.iconURL()! })
    .setTitle("Configure Farewell Settings")
    .setDescription(
      `**»** **Status »»»** ${status(data.farewell?.enabled)}\n**»** **Channel »»»** ${data.farewell?.channelId ? channelMention(data.farewell.channelId) : "None"}`,
    )
    .setColor("Blurple")
    .setTimestamp();

  const channelSelect =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId(NeetButton.generateId("settings", "farewell").generatedId)
        .setChannelTypes([ChannelType.GuildText])
        .setDisabled(reverse(data.farewell?.enabled))
        .setMaxValues(1),
    );

  const buttonId = NeetButton.generateId("settings", "farewell").setParameters([
    { name: "to", value: `${reverse(data.farewell?.enabled)}` },
  ]);

  const statusButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(buttonId)
      .setLabel(status(data.farewell?.enabled, true))
      .setStyle(
        data.farewell?.enabled ? ButtonStyle.Danger : ButtonStyle.Success,
      ),
  );

  return await interaction.editReply({
    embeds: [embed],
    components: [channelSelect, statusButton],
  });
}
