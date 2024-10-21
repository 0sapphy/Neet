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

  let data = await Setting.findOne({ guildId: guildId });
  if (!data) {
    data = await Setting.create({ guildId });
    data.save();
  }

  if (!data) {
    return interaction.editReply("[ERROR]: DB Error.");
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: guild.name, iconURL: guild.iconURL()! })
    .setTitle("Configure Welcome Settings")
    .setDescription(
      `**»** **Status »»»** ${status(data.welcome?.enabled)}\n**»** **Channel »»»** ${data.welcome?.channelId ? channelMention(data.welcome.channelId) : "None"}`,
    )
    .setColor("Blurple")
    .setTimestamp();

  const channelSelect =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId(customId("settings", "welcome"))
        .setChannelTypes([ChannelType.GuildText])
        .setMaxValues(1)
        .setDisabled(reverse(data.welcome?.enabled)),
    );

  const buttonId = customId("settings", "welcome", [
    { name: "to", value: `${reverse(data.welcome?.enabled)}` },
  ]);

  const settingButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(buttonId)
      .setLabel(status(data.welcome?.enabled, true))
      .setStyle(
        data.welcome?.enabled ? ButtonStyle.Danger : ButtonStyle.Success,
      ),

    new ButtonBuilder()
      .setCustomId(
        customId("settings", "message", [{ name: "for", value: "welcome" }]),
      )
      .setLabel("Message Options")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(reverse(data.welcome?.enabled)),
  );

  return await interaction.editReply({
    embeds: [embed],
    components: [channelSelect, settingButtons],
  });
}
