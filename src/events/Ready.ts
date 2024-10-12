import { Events } from "discord.js";
import { Neet, NeetEvent } from "../../lib";
import { writeInfo } from "../helpers/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Deploy } from "../../scripts/deploy";

export default new NeetEvent<"ready">({
  name: Events.ClientReady,
  once: true,

  //@ts-expect-error Type Error
  run: async (client: Neet<true>) => {
    writeInfo(`${client.user.username} is ready!`);

    //await Deploy();
  },
});
