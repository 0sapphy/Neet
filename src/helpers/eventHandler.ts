import { Neet } from "../../lib";
import { readdir } from "node:fs/promises";
import { INeetEvent } from "../../lib/Types/neet";
import signale from "signale";

export async function Event(client: Neet) {
  const files = await readdir("./src/events/");
  let amount = 0;

  for (const file of files) {
    const event: INeetEvent = (await import(`../events/${file.replace(".ts", "")}`))
    .default?.options;

    client[event.once ? "once" : "on"](event.name, (...args) =>
      event.run(...args),
    );

    amount++;
  }

  signale.complete({ prefix: "[HANDLERS]", message: `Loaded ${amount} events.` });
}
