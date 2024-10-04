import process from "node:process";
import { Neet } from "../lib";
import { writeError } from "./helpers/logger";

process.loadEnvFile(".env");

import { Database } from "./helpers/databaseHandler";
import { Event } from "./helpers/eventHandler";
import { Command } from "./helpers/commandHandler";

const client = new Neet({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
  shards: "auto",
});

process.on("unhandledRejection", (reason, promise) => {
  writeError("handledRejection", promise);
});

process.on("uncaughtException", (error) => {
  writeError("caughtException", error);
});

async function main() {
  try {
    Database();
    Event(client);
    Command(client);

    await client.login(process.env.TOKEN);
  } catch (error) {
    writeError("Client Login Error", error);
    await client.destroy();
  }
}

void main();
