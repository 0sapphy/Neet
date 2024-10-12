import {
  ActionRowBuilder,
  APIButtonComponent,
  APIChannelSelectComponent,
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction,
  EmbedBuilder,
} from "discord.js";
import Guilds from "../../../../models/Guilds";
import { status } from "../../../../helpers/utils";

/**
 * Executed from /settings welcome
 */

export async function run(interaction: ChannelSelectMenuInteraction) {
  const { message } = interaction;

  await interaction.deferReply({ ephemeral: true });
  const channelId = interaction.values.at(0);

  const data = await Guilds.findOneAndUpdate(
    { guildId: interaction.guildId },
    {
      settings: { welcome: { channel: channelId } },
    },
    { new: true },
  );

  if (!data) {
    interaction.editReply(`[ERROR]: database error.`);
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTitle("Saved Welcome Settings")
    .setDescription(`**»»** Channel: <#${data?.settings?.welcome?.channel}>`)
    .setColor("Blurple")
    .setTimestamp();

  const OriginalEmbed = EmbedBuilder.from(
    message.embeds[0].data,
  ).setDescription(
    `**»»** Status: ${status(data?.settings?.welcome?.enabled)}\n**»»** Channel: <#${data?.settings?.welcome?.channel}>`,
  );

  const button = ActionRowBuilder.from(message.components[1]).setComponents(
    ButtonBuilder.from(
      message.components[1].components[0].toJSON() as APIButtonComponent,
    ),
  ) as ActionRowBuilder<ButtonBuilder>;

  const channelSelect = ActionRowBuilder.from(
    message.components[0],
  ).setComponents(
    ChannelSelectMenuBuilder.from(
      message.components[0].components[0].toJSON() as APIChannelSelectComponent,
    ).setDefaultChannels([channelId!]),
  ) as ActionRowBuilder<ChannelSelectMenuBuilder>;

  await interaction.message.edit({
    embeds: [OriginalEmbed],
    components: [channelSelect, button],
  });

  return await interaction.editReply({ embeds: [embed] });
}
