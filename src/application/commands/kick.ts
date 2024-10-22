import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { NeetCommandBuilder } from "../../../lib";
import { CommandMode, CommandRunType } from "../../../lib/Types/enum";
import { emoji } from "../../helpers/utils";
import { writeError, writeWarn } from "../../helpers/logger";
import { Guild, ModerationCaseActions } from "../../models/Guilds";

export async function run(interaction: ChatInputCommandInteraction<"cached">) {
  const { options } = interaction;

  const member = options.getMember("member");
  const reason = options.getString("reason") || "No Reason Provided";

  if (!member) {
    return interaction.reply({
      embeds: [
        WarningEmbed(
          "Member Not Found",
          `${emoji("Xmark")} Member not found in this server.`,
        ),
      ],
      ephemeral: true,
    });
  }

  if (
    member.roles.highest.position > interaction.member.roles.highest.position
  ) {
    return interaction.reply({
      embeds: [
        WarningEmbed(
          "Member Has a Higher Role",
          `${emoji("Xmark")} ${member.user.username} has a higher role than you (${interaction.user.username})`,
        ),
      ],
      ephemeral: true,
    });
  }

  if (!member.kickable) {
    return interaction.reply({
      embeds: [
        WarningEmbed(
          "Member Is Not Kickable",
          `${emoji("Xmark")} I can't kick this member.`,
        ),
      ],
      ephemeral: true,
    });
  }

  await interaction.deferReply();
  const DMEmbed = new EmbedBuilder()
    .setAuthor({
      name: interaction.guild.name,
      iconURL: interaction.guild.iconURL()!,
    })
    .setTitle(`You were kicked from ${interaction.guild.name}`)
    .setDescription(`> **Reason**\n${reason}`)
    .setColor("Orange")
    .setTimestamp();

  await member
    .send({ embeds: [DMEmbed] })
    .catch((warn) => writeWarn("KickMember Warn", warn.rawError.message));

  try {
    await member.kick(reason);

    await Guild.createCase(interaction.guildId, {
      userId: member.id,
      moderatorId: interaction.user.id,
      actionType: ModerationCaseActions.Kick,
      reason,
    });
  } catch (error) {
    writeError("KickMember Error", error);
  } finally {
    const embed = new EmbedBuilder()
      .setDescription(`${emoji("Checkmark")} | Kicked ${member} | ${reason}`)
      .setColor("Blurple")
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
}

export default new NeetCommandBuilder({
  name: "kick",
  description: "Kick a member from this server",
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: "member",
      description: "The member to kick.",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "reason",
      description: "The reason to kick this member",
      required: false,
    },
  ],
}).addHandlerOptions((options) => {
  return options
    .setMode(CommandMode.DEVELOPING_STAGE)
    .setRunType(CommandRunType.THIS);
});

function WarningEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor("Orange")
    .setTimestamp();
}
