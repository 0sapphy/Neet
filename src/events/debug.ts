import { Events } from "discord.js";
import { NeetEvent } from "../../lib";
import signale from "signale";

export default new NeetEvent<"debug">({
  name: Events.Debug,
  once: false,
  run: (message) => signale.debug({ prefix: "[DiscordJS]", message })
});
