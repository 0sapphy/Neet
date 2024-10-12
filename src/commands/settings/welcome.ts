import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import Guilds from "../../models/Guilds";
import { NeetButton } from "../../../lib";
import { reverse, status } from "../../helpers/utils";
import { createDefaults } from "../../helpers/database";

export async function run(interaction: ChatInputCommandInteraction<"cached">) {
  await interaction.deferReply();

  let data = await Guilds.findOne({ guildId: interaction.guildId });
  if (!data)
    data = await (
      await Guilds.create(
        createDefaults("guild", { guildId: interaction.guildId }),
      )
    ).save();

  const settings = data.settings;

  const buttonCustomId = NeetButton.generateId(
    "welcome",
    "status",
  ).setParameters([
    { name: "to", value: `${reverse(settings?.welcome?.enabled)}` },
  ]);

  const ButtonActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(buttonCustomId)
      .setLabel(status(settings?.welcome?.enabled, true))
      .setStyle(
        settings?.welcome?.enabled ? ButtonStyle.Danger : ButtonStyle.Success,
      ),
  );

  const ChannelSelectMenu =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setDisabled(reverse(settings?.welcome?.enabled))
        .setCustomId(NeetButton.generateId("welcome", "channel").generatedId)
        .setMaxValues(1)
        .setChannelTypes([ChannelType.GuildText]),
    );

  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTitle("Configure Welcome Settings")
    .setDescription(
      `**»»** Status: ${status(settings?.welcome?.enabled)}\n**»»** Channel: ${settings?.welcome?.channel ? `<#${settings.welcome.channel}>` : "None"}`,
    )
    .setColor("Blurple")
    .setTimestamp();

  interaction.editReply({
    embeds: [embed],
    components: [ChannelSelectMenu, ButtonActionRow],
  });
}
