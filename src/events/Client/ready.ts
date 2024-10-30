/** @format */

import { Events } from "discord.js";
import { Bot, NeetClient } from "../../lib";

export default {
	name: Events.ClientReady,
	once: true,
	run: async (client: NeetClient) => {
		Bot.success(`${client.user?.username}, is ready!`);

		//await client.registerCommands();
	}
};
