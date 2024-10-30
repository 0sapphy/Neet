/** @format */

import { GatewayIntentBits } from "discord.js";
import { NeetClient } from "./lib";
import { Bot, Debug } from "./lib";
import database from "./handlers/database";
import event from "./handlers/event";
import command from "./handlers/command";

const client = new NeetClient({
	intents: [GatewayIntentBits.Guilds]
});

async function main() {
	try {
		Debug.Process("Loading handlers...");
		await database();
		await event(client);
		await command(client);
		await client.login(process.env.TOKEN);
	} catch (error) {
		Bot.fatal(error);
		await client.destroy();
	}
}

void main();
