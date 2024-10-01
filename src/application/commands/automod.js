const { SlashCommandBuilder, InteractionContextType } = require("discord.js");

module.exports = {
  options: {
    member_permissions: ["ManageGuild"],
    client_permissions: ["ManageMessages"],
  },

  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Automoderation commands.")
    .setContexts([InteractionContextType.Guild])

    .addSubcommand((command) => {
      return command
        .setName("settings")
        .setDescription("View all AutoModeration settings.");
    })

    .addSubcommandGroup((command) => {
      return command
        .setName("links")
        .setDescription("Automod certain links.")

        .addSubcommand((sub) => {
          return sub
            .setName("invite")
            .setDescription("Disable the use of invites links.")

            .addBooleanOption((option) => {
              return option
                .setName("enabled")
                .setDescription("Enable/Disable this module.")
                .setRequired(true);
            })

            .addStringOption((option) => {
              return option
                .setName("white_list")
                .setDescription('Invite code / vanity separate by "|"')
                .setRequired(false);
            });
        });
    }),
};
