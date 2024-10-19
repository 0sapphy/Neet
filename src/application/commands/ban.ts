import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  EmbedBuilder,
  User,
} from "discord.js";
import { NeetCommandBuilder } from "../../../lib";
import { CommandMode, CommandRunType } from "../../../lib/Types/enum";
import { emoji } from "../../helpers/utils";
import { writeError, writeWarn } from "../../helpers/logger";
import { Guild, ModerationCaseActions } from "../../models/Guilds";

export async function run(interaction: ChatInputCommandInteraction<"cached">) {
  const { options } = interaction;

  const user = options.getUser("user", true);
  const reason = options.getString("reason") || "No Reason Provided";

  // [NOTE] - If the "user" is in the guild.
  if (options.getMember("user") instanceof GuildMember) {
    const member = options.getMember("user") as GuildMember;

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    ) {
      return interaction.reply({
        embeds: [
          WarningEmbed(
            "Member Has a Higher Role",
            `${member.user.username} has a higher role than you (${interaction.user.username})`,
          ),
        ],
        ephemeral: true,
      });
    }

    if (!member.bannable) {
      return interaction.reply({
        embeds: [
          WarningEmbed(
            "Member Is Not Bannable",
            `${emoji("Xmark")} I can't ban this member.`,
          ),
        ],
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    await BanMember(interaction, member, { reason });
    return;
  }

  await interaction.deferReply();
  await BanMember(interaction, user, { reason });
  return;
}

export default new NeetCommandBuilder({
  name: "ban",
  description: "Ban a user from this server",
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user to ban.",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "reason",
      description: "The reason to ban this user.",
      required: false,
    },
  ],
}).addHandlerOptions((options) => {
  return options
    .setMode(CommandMode.TESTING_STAGE)
    .setUserPermissions(["BanMembers"])
    .setClientPermissions(["BanMembers"])
    .setRunType(CommandRunType.THIS);
});

async function BanMember(
  interaction: ChatInputCommandInteraction<"cached">,
  member: GuildMember | User,
  options: { reason: string },
) {
  const DMEmbed = new EmbedBuilder()
    .setAuthor({
      name: interaction.guild.name,
      iconURL: interaction.guild.iconURL()!,
    })
    .setTitle(`You were banned from ${interaction.guild.name}`)
    .setDescription(`> **Reason**\n${options.reason}`)
    .setColor("Red")
    .setTimestamp();

  await member
    .send({ embeds: [DMEmbed] })
    .catch((reason) => writeWarn("BanMember Warn", reason.rawError.message));

  try {
    await interaction.guild.bans.create(member, {
      reason: options.reason,
    });

    await Guild.CREATEcase(interaction.guildId, {
      userId: member.id,
      moderatorId: interaction.user.id,
      actionType: ModerationCaseActions.Ban,
      reason: options.reason,
    });
  } catch (error) {
    writeError("BanMember Error", error);
  } finally {
    const embed = new EmbedBuilder()
      .setDescription(
        `${emoji("Checkmark")} | Banned ${member} | ${options.reason}`,
      )
      .setColor("Blurple")
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
}

function WarningEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor("Orange")
    .setTimestamp();
}
