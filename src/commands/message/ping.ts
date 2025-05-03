import { MessageCommandStructure } from "../../../lib/DiscordJS/types.client";

export default {
	name: "ping",
	aliases: ["p"],
	run(context) {
		return context;
	}
} satisfies MessageCommandStructure;
