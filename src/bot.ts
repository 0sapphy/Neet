process.loadEnvFile(".env");

import { Neet } from "../lib";
import { writeError } from "./helpers/logger";
import { Database } from "./helpers/databaseHandler";
import { Event } from "./helpers/eventHandler";
import { Command } from "./helpers/commandHandler";

const client = new Neet({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
  shards: "auto",
});

process.on("unhandledRejection", ($, promise) => {
  writeError("handledRejection", promise);
});

process.on("uncaughtException", (error) => {
  writeError("caughtException", error);
});

async function Main() {
  try {
    // Load all the handlers.
    Database();
    Event(client);
    Command(client);

    await client.login(process.env.TOKEN);
  } catch (error) {
    writeError("Client Login Error", error);
    await client.destroy();
  }
}

void Main();
