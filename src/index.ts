import { GatewayIntentBits } from "discord.js";
import { NeetClient } from "./lib";
import { Bot, Debug } from "./lib";
import database from "./handlers/database.ts";

const client = new NeetClient({
	intents: [GatewayIntentBits.Guilds],
});

async function main() {
	try {
		Debug.Process("Loading handlers...");
		await database();
		await client.login(Bun.env.TOKEN);
	} catch (error) {
		Bot.fatal(error);
		await client.destroy();
	}
}

void main();
