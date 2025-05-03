import { Neet } from "../../lib";
import { EventStructure } from "../../lib/DiscordJS/types.client";

export default {
	name: "ready",
	type: "once",
	run: (client: Neet<true>) => {
		client.logger.client.info("Logged in as " + client.user.username);
	}
} as EventStructure<"ready">;
