const { writeInfo } = require("../helpers/logger");

/** @param {import('discord.js').Client} client */
module.exports = async (client) => {
  writeInfo(`${client.user.username} is ready!`);

  //await require("../../scripts/deploy").syncCommands(client.commands);
};
