const { writeError } = require("../../helpers/logger");
const { EmbedBuilder } = require("discord.js");
const Users = require("../../models/Users");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
  const { options, user: iuser } = interaction;
  await interaction.deferReply();

  const user = options.getUser("user");
  const embed = new EmbedBuilder()
    .setAuthor({ name: iuser.username, iconURL: iuser.displayAvatarURL() })
    .setColor("Blurple")
    .setTimestamp();

  try {
    const data = await Users.find();
    const ALL_CASES = data.flatMap((user) => user.cases);
    const cases = ALL_CASES.filter((_case) => _case.moderator_id === user.id);

    if (cases.length === 0) {
      embed.setDescription(
        `No moderation case created by: **${user.username}**`,
      );
      return interaction.editReply({ embeds: [embed] });
    }

    const _formatted = cases
      .slice(0, 20)
      .map((_case) => `\`-\` **${_case.action}** <@${_case.user_id}>`)
      .join("\n\n");

    embed.setDescription(
      `## Found **${cases.length}** Moderation Cases\n\n- ${user} has **created** a total of **${cases.length}** moderation cases.\n\n${_formatted}`,
    );

    return interaction.editReply({ embeds: [embed] });
  } catch (error) {
    writeError(error);
  }
};
