import "@std/dotenv/load";
import { GatewayIntentBits } from "discord.js";
import { NeetClient } from "lib:exports";
import { Bot, Debug } from "lib:logger";
import database from "./handlers/database.ts";

const client = new NeetClient({
	intents: [GatewayIntentBits.Guilds],
});

async function main() {
	try {
		Debug.Process("Loading handlers...");
		await database();
		await client.login(Deno.env.get("TOKEN"));
	} catch (error) {
		Bot.fatal(error);
		await client.destroy();
	}
}

void main();
