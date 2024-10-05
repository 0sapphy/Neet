import { Events } from "discord.js";
import { Neet, NeetEvent } from "../../lib";
import { writeInfo } from "../helpers/logger";

import { Deploy } from "../../scripts/deploy";

export default new NeetEvent<"ready">({
  name: Events.ClientReady,
  once: true,

  //@ts-ignore
  run: async (client: Neet<true>) => {
    writeInfo(`${client.user.username} is ready!`);

    await Deploy(client.commands);
  },
});
