const { readdir } = require("node:fs/promises");
const { writeWarn, writeInfo } = require("./logger");

/** @param {import('discord.js').Client} client */
module.exports = async (client) => {
  const files = await readdir("./src/commands/");
  let amount = 0;

  for (const file of files) {
    const command = require(`../commands/${file}`);

    if (!command.data) {
      writeWarn(`Missing command #data at ${file}`, command);
    }

    const data = {
      command,
      data: command.data.toJSON(),
    };

    client.commands.set(command.data.name, data);
    amount++;
  }

  writeInfo(`Loaded ${amount} commands.`);
};
