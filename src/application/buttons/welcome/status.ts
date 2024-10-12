import {
  ActionRowBuilder,
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  APIButtonComponent,
  APIChannelSelectComponent,
} from "discord.js";
import { NeetButton, NeetButtonParameters } from "../../../../lib";
import Guilds from "../../../models/Guilds";
import { emoji, reverse, status as UStatus } from "../../../helpers/utils";

export async function run(
  interaction: ButtonInteraction<"cached">,
  parameters: NeetButtonParameters,
) {
  const { message } = interaction;

  await interaction.deferReply({ ephemeral: true });

  const status = parameters.boolean("to");
  if (!status) return; // This won't execute.

  /* (**FOR SOME REASON MONGOOSE OVERRIDES THE PREV CHANGES**)
   * Change welcome.enabled to Boolean(true) it saves that change
   * BUT, It defaults the welcome.channel to null
   * So the current fix is to make two request.
   */
  //const data = await Guilds.findOne({ guildId: interaction.guildId });
  const data = await Guilds.findOneAndUpdate(
    { guildId: interaction.guildId },
    {
      settings: {
        welcome: {
          enabled: status,
          /*channel: data?.settings?.welcome?.channel
            ? data.settings.welcome.channel
            : null,*/
        },
      },
    },
    { new: true },
  );

  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTitle(`${emoji("Checkmark")} Saved Welcome Settings`)
    .setDescription(
      `**»»** Status: ${UStatus(data?.settings?.welcome?.enabled)}`,
    )
    .setColor("Blurple")
    .setTimestamp();

  const OriginalEmbed = EmbedBuilder.from(
    message.embeds[0].data,
  ).setDescription(
    `**»»** Status: ${UStatus(data?.settings?.welcome?.enabled)}\n**»»** Channel: ${data?.settings?.welcome?.channel ? `<#${data.settings.welcome.channel}>` : "None"}`,
  );

  const customId = NeetButton.generateId("welcome", "status").setParameters([
    { name: "to", value: `${reverse(status)}` },
  ]);

  const button = ActionRowBuilder.from(message.components[1]).setComponents(
    ButtonBuilder.from(
      message.components[1].components[0] as APIButtonComponent,
    )
      .setCustomId(customId)
      .setLabel(UStatus(status, true))
      .setStyle(status ? ButtonStyle.Danger : ButtonStyle.Success),
  ) as ActionRowBuilder<ButtonBuilder>;

  const channelSelect = ActionRowBuilder.from(
    message.components[0],
  ).setComponents(
    ChannelSelectMenuBuilder.from(
      message.components[0].components[0].toJSON() as APIChannelSelectComponent,
    ).setDisabled(reverse(status)),
  ) as ActionRowBuilder<ChannelSelectMenuBuilder>;

  await message.edit({
    embeds: [OriginalEmbed],
    components: [channelSelect, button],
  });

  return await interaction.editReply({ embeds: [embed] });
}
