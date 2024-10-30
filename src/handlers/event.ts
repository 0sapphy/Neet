/** @format */

import { Debug, Bot, NeetClient } from "../lib";
import fs from "node:fs";

export default async function (client: NeetClient) {
	let clientEvents = 0;
	let processEvents = 0;
	const directories = fs.readdirSync("./src/events/");

	for (const directory of directories) {
		const files = fs.readdirSync(`./src/events/${directory}/`);

		for (const file of files) {
			const event = await import(`../events/${directory}/${removePrefix(file)}`);
			const data = event.default;
			data.type ??= "client";

			if (!data.name || !data.run) {
				Debug.warn(`Missing .name | .run properties in ./events/${directory}/${removePrefix(file)}`);
			}

			if (data.type === "process") {
				process[data.once ? "once" : "on"](data.name, (...args) => data.run(...args));
				processEvents++;
			} else {
				client[data.once ? "once" : "on"](data.name, (...args) => data.run(...args));
				clientEvents++;
			}
		}
	}

	Bot.note(`Loaded process (${processEvents}) & client (${clientEvents}) events.`);
}

function removePrefix(ctx: string) {
	return ctx.replace(".ts", "");
}
