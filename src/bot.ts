process.loadEnvFile(".env");

import { Neet } from "../lib";
import { Database } from "./helpers/databaseHandler";
import { Event } from "./helpers/eventHandler";
import { Command } from "./helpers/commandHandler";
import signale from "signale";

const client = new Neet({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
  shards: "auto"
});

process.on("unhandledRejection", ($) => {
  signale.error("unhandledRejection", $);
});

process.on("uncaughtException", (error) => {
  signale.error("uncaughtException", error);
});

async function Main() {
  try {
    signale.start({ prefix: "[HANDLERS]", message: `Loading ALL the handlers.` });

    // Load all the handlers.
    Database();
    Event(client);
    Command(client);

    await client.login(process.env.TOKEN);
  } catch (error) {
    signale.error(`Login / Handler error`, error);
    await client.destroy();
  }
}

void Main();
