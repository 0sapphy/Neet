const { writeInfo } = require("./logger");
const { readdir } = require("node:fs/promises");

/** @param {import('discord.js').Client} client */
module.exports = async (client) => {
  const files = await readdir("./src/events/");
  let name;
  let amount = 0;

  for (const file of files) {
    const event = require(`../events/${file}`);
    if (!event.data) name = file.replace(".js", "");
    else name = event.data.name;

    client[event.data?.once ? "once" : "on"](name, (...args) =>
      event.data ? event.data.run(...args) : event(...args),
    );

    amount++;
  }

  writeInfo(`Loaded ${amount} events.`);
};
