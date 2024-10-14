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
import Settings from "../../models/Settings";
import { createDefaults } from "../../helpers/database";
import { reverse, status } from "../../helpers/utils";
import { NeetButton } from "../../../lib";

export async function run(interaction: ChatInputCommandInteraction<"cached">) {
  const { guildId, guild } = interaction;
  await interaction.deferReply();

  let data = await Settings.findOne({ guildId: guildId });
  if (!data) {
    data = await Settings.create(createDefaults("setting", { guildId }));
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
        .setCustomId(NeetButton.generateId("settings", "welcome").generatedId)
        .setChannelTypes([ChannelType.GuildText])
        .setMaxValues(1)
        .setDisabled(reverse(data.welcome?.enabled)),
    );

  const buttonId = NeetButton.generateId("settings", "welcome").setParameters([
    { name: "to", value: `${reverse(data.welcome?.enabled)}` },
  ]);

  const statusButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(buttonId)
      .setLabel(status(data.welcome?.enabled, true))
      .setStyle(
        data.welcome?.enabled ? ButtonStyle.Danger : ButtonStyle.Success,
      ),
  );

  return await interaction.editReply({
    embeds: [embed],
    components: [channelSelect, statusButton],
  });
}
