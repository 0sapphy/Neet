const { SlashCommandBuilder, InteractionContextType } = require("discord.js");

module.exports = {
  options: {
    member_permissions: ["ModerateMembers"],
  },

  data: new SlashCommandBuilder()
    .setName("cases")
    .setDescription(
      "View the moderation cases for this server / a moderator/user.",
    )
    .setContexts([InteractionContextType.Guild])

    .addSubcommand((command) => {
      return command
        .setName("server")
        .setDescription("View all the cases created in this server.");
    })

    .addSubcommand((command) => {
      return command
        .setName("moderator")
        .setDescription("View all the moderation cases created by a moderator.")
        .addUserOption((option) => {
          return option
            .setName("user")
            .setDescription("No description provided.")
            .setRequired(true);
        });
    })

    .addSubcommand((command) => {
      return command
        .setName("user")
        .setDescription("View all the moderation cases for a user.")

        .addUserOption((option) => {
          return option
            .setName("target")
            .setDescription("The target user/id.")
            .setRequired(true);
        });
    }),
};
