import { Neet } from "../../lib";
import { EventStructure } from "../../lib/DiscordJS/types.client";
import db from "../mongoose";

export default {
	name: "ready",
	type: "once",
	run: (client: Neet<true>) => {
		client.deployCommands();
		client.logger.ready("Logged in as " + client.user.username);

		if (client.user.id != process.env.DEV_CLIENT_ID) process.env.NODE_ENV = "production";
		else process.env.NODE_ENV = "development";

		db.connect();
	}
} as EventStructure<"ready">;
