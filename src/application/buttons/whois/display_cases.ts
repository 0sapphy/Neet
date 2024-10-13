import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { NeetButtonParameters } from "../../../../lib";
import { getCases } from "../../../helpers/database";
import { EnumModerationCaseFilterProperties } from "../../../models/Guilds";

export async function run(
  interaction: ButtonInteraction<"cached">,
  parameters: NeetButtonParameters,
) {
  if (!interaction.member.permissions.has("ModerateMembers")) {
    return interaction.reply({
      embeds: [
        WarningEmbed(
          "Not Enough Permissions",
          "You don't have enough permissions to use this command",
        ),
      ],
    });
  }

  await interaction.deferReply({ ephemeral: true });

  const userId = parameters.get("user");
  if (!userId) return; // This will never get executed.

  const data = await getCases(
    interaction.guildId,
    EnumModerationCaseFilterProperties.userId,
    userId,
  );

  if (!data) {
    return interaction.editReply({
      embeds: [
        WarningEmbed("No Moderation Case", `No moderation case for this user.`),
      ],
    });
  }

  const embed = new EmbedBuilder()
    .setTitle(`Moderation Cases: ${userId}`)
    .setDescription(
      data
        .flatMap(
          (i) =>
            `${i.caseId}\n**»** Action: ${i.actionType}\n**»** Reason: ${i.reason}\n**»** Moderator: <@${i.moderatorId}>`,
        )
        .join("\n\n"),
    )
    .setColor("Orange")
    .setTimestamp();

  return interaction.editReply({ embeds: [embed] });
}

function WarningEmbed(title: string, description: string) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor("Orange")
    .setTimestamp();
}
