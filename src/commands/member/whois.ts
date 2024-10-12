import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { emoji } from "../../helpers/utils";
import { getCases } from "../../helpers/database";
import { NeetButton } from "../../../lib";

export async function run(interaction: ChatInputCommandInteraction<"cached">) {
  await interaction.deferReply();

  let ack = false;
  const embed = new EmbedBuilder();
  const user = interaction.options.getUser("user", true);

  // * Check if the user is in the server.
  const member = interaction.options.getMember("user");
  if (member) {
    embed
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setTitle(`${emoji("Checkmark")} Information | ${user.username}`)
      .setDescription(
        `**»** Username: ${user.username}\n**»** Created At: ${user.createdAt}\n**»** Joined At: ${member.joinedAt}`,
      )
      .setColor(
        member.roles.highest.hexColor
          ? member.roles.highest.hexColor
          : "Blurple",
      )
      .setTimestamp();

    ack = true;
  }

  if (!ack) {
    embed
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTitle(`${emoji("Checkmark")} Information | ${user.username}`)
      .setDescription(
        `**»** Username: ${user.username}\n**»** Created At: ${user.createdAt}`,
      )
      .setColor("Blurple")
      .setTimestamp();

    ack = true;
  }

  // TODO: Case buttons
  const cases = await getCases({
    guildId: interaction.guildId,
    userId: user.id,
  });

  if (
    cases != false &&
    cases.length > 0 &&
    interaction.member.permissions.has("ModerateMembers")
  ) {
    const customId = NeetButton.generateId(
      "whois",
      "display_cases",
    ).setParameters([{ name: "user", value: user.id }]);

    const CaseButtonActionRow =
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(customId)
          .setLabel("Moderation Cases")
          .setStyle(ButtonStyle.Danger),
      );

    return interaction.editReply({
      embeds: [embed],
      components: [CaseButtonActionRow],
    });
  }

  return interaction.editReply({ embeds: [embed] });
}
