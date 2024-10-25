import { Events } from "discord.js";
import { Neet, NeetEvent } from "../../lib";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Deploy } from "../../scripts/deploy";
import signale from "signale";

export default new NeetEvent<"ready">({
  name: Events.ClientReady,
  once: true,

  //@ts-expect-error Type Error
  run: async (client: Neet<true>) => {
    signale.success({ prefix: "[NEET]", message: `${client.user.username} is ready!` });

    //await Deploy();
  },
});
