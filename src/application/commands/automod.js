const { SlashCommandBuilder, InteractionContextType } = require("discord.js");

module.exports = {
  options: {
    member_permissions: ["ManageGuild"],
    client_permissions: ["ManageMessages"],
  },

  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Auto-Moderation Commands")
    .setContexts([InteractionContextType.Guild])

    .addSubcommandGroup((command) => {
      return command
        .setName("links")
        .setDescription("Auto-Moderate Links.")

        .addSubcommand((sub) => {
          return sub
            .setName("invite")
            .setDescription("Auto-Moderate Invite Links.")
            .addBooleanOption((option) => {
              return option
                .setName("enabled")
                .setDescription("Enable / Disable Invite Link Auto-Moderation.")
                .setRequired(true);
            });
        });
    }),
};
