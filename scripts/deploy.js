process.loadEnvFile(".env");
const { REST, Routes } = require("discord.js");
const { writeInfo } = require("../src/helpers/logger");

async function syncCommands(commands) {
  const rest = new REST().setToken(process.env.TOKEN);

  writeInfo("Deploying (/) commands.");

  const data = await rest.put(Routes.applicationCommands(process.env.ID), {
    body: parseData(commands),
  });

  writeInfo("Deployed (/) commands.");

  return data;
}

/**
 * @param {import('discord.js').Collection<string, {command:any, data:any}>} collection
 */
function parseData(collection) {
  const data = [];

  collection.forEach((value) => {
    data.push(value.data);
  });

  return data;
}

module.exports = {
  syncCommands,
  parseData,
};
