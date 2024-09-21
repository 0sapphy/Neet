const { writeInfo } = require("../helpers/logger");

/** @param {import('discord.js').Client} client */
module.exports = (client) => {
  writeInfo(`${client.user.username} is ready!`);
};
