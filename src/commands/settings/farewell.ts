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
import { customId } from "../../../lib";

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
        .setCustomId(customId("settings", "farewell"))
        .setChannelTypes([ChannelType.GuildText])
        .setDisabled(reverse(data.farewell?.enabled))
        .setMaxValues(1),
    );

  const buttonId = customId("settings", "farewell", [
    { name: "to", value: `${reverse(data.farewell?.enabled)}` },
  ]);

  const statusButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(buttonId)
      .setLabel(status(data.farewell?.enabled, true))
      .setStyle(
        data.farewell?.enabled ? ButtonStyle.Danger : ButtonStyle.Success,
      ),

    new ButtonBuilder()
      .setCustomId(
        customId("settings", "message", [{ name: "for", value: "farewell" }]),
      )
      .setLabel("Message Options")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(reverse(data.farewell?.enabled)),
  );

  return await interaction.editReply({
    embeds: [embed],
    components: [channelSelect, statusButton],
  });
}
