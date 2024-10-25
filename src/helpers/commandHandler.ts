import { Neet } from "../../lib";
import { readdir } from "node:fs/promises";
import { INeetCommand } from "../../lib/Types/neet";
import { CommandRunType } from "../../lib/Types/enum";
import signale from "signale";

export async function Command(client: Neet) {
  const files = await readdir("./src/application/commands/");
  let amount = 0;

  for (const file of files) {
    const rmts = file.replace(".ts", "");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const command_file = require(`../application/commands/${rmts}`);
    const command: INeetCommand = command_file.default;

    if (command.handler?.run_type === CommandRunType.HANDLE) {
      client.commands.set(command.data.name, command);
    } else {
      const run = command_file.run;
      client.commands.set(command.data.name, {
        data: command.data,
        handler: command.handler,
        run: run,
      });
    }

    amount++;
  }

  signale.complete({ prefix: "[HANDLERS]", message: `Loaded ${amount} commands.` });
}
