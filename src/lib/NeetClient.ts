import { Client, type ClientOptions, Collection } from "npm:discord.js";

export class NeetClient extends Client {
	public constructor(options: ClientOptions) {
		super(options);
	}

	public commands = new Collection<string, unknown>();
}
