const { EmbedBuilder } = require("discord.js");
const Users = require("../../models/Users");

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
module.exports = async (interaction) => {
  const { guild } = interaction;
  await interaction.deferReply();

  const data = await Users.find();
  const ALL_CASES = data.flatMap((user) => user.cases);
  const cases = ALL_CASES?.filter((_case) => _case.guild_id === guild.id);
  const recent_case = cases ? cases.pop() : false;

  const embed = new EmbedBuilder()
    .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
    .setDescription(
      `- There is a total of **${cases.length + 1}** cases in this **server**.${recent_case ? `\n\n- The most **recent** case created **in this server** was created by: <@${recent_case.moderator_id}>\n  - **Action:** ${recent_case.action}\n  - **Target:** <@${recent_case.user_id}>\n  - **Reason:** ${recent_case.reason}` : ""}`,
    )
    .setColor("Blurple")
    .setTimestamp();

  return interaction.editReply({ embeds: [embed] });
};
