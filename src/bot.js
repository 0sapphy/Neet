process.loadEnvFile(".env");
const { Client, Collection } = require("discord.js");
const { writeError } = require("./helpers/logger");

const client = new Client({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
  shards: "auto",
});

client.commands = new Collection();

process.on("unhandledRejection", (reason, promise) => {
  writeError("handledRejection", promise);
});

process.on("uncaughtException", (error) => {
  writeError("caughtException", error);
});

const main = async () => {
  try {
    require("./helpers/databaseHandler")();
    require("./helpers/eventHandler")(client);
    require("./helpers/commandHandler")(client);
    client.login(process.env.TOKEN);
  } catch (error) {
    writeError("Client Login Error", error);
    client.destroy();
  }
};

void main();
