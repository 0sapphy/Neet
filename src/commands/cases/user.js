const { EmbedBuilder } = require("discord.js");
const Users = require("../../models/Users");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
  const { options, user: iuser } = interaction;
  await interaction.deferReply();

  const user = options.getUser("target");

  const data = await Users.find();
  const ALL_CASES = data.flatMap((user) => user.cases);
  const cases = ALL_CASES.filter((_case) => _case.user_id === user.id);

  const embed = new EmbedBuilder()
    .setAuthor({ name: iuser.username, iconURL: iuser.displayAvatarURL() })
    .setColor("Blurple")
    .setTimestamp();

  if (cases.length === 0) {
    embed.setDescription(`No moderation cases were found for ${user}`);
    return interaction.editReply({ embeds: [embed] });
  }

  embed.setTitle(`Found ${cases.length} Cases`).setDescription(
    `${cases
      .slice(0, 30)
      .map(
        (_case) =>
          `- ${_case.case_id} - ${_case.action}\n  - **Moderator:** <@${_case.moderator_id}>\n  - **Reason:** ${_case.reason.length > 10 ? _case.reason.slice(0, 10) + "..." : _case.reason}`,
      )
      .join("\n\n")}`,
  );

  return interaction.editReply({ embeds: [embed] });
};
