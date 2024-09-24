const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure guild settings.")

    .addSubcommand((command) => {
      return command
        .setName("settings")
        .setDescription("View all configurable settings.");
    }),
};
