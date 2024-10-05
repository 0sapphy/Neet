import { Neet } from "../../lib";
import { writeInfo } from "./logger";
import { readdir } from "node:fs/promises";
import { INeetEvent } from "../../lib/Types/neet";

export async function Event(client: Neet) {
  const files = (await readdir("./src/events/")).filter(
    (file) => file != "@template.ts",
  );

  let amount = 0;

  for (const file of files) {
    const event: INeetEvent = require(`../events/${file.replace(".ts", "")}`)
      .default?.options;

    client[event.once ? "once" : "on"](event.name!, (...args) =>
      event.run(...args),
    );

    amount++;
  }

  writeInfo(`Loaded ${amount} events.`);
}
