import { Events } from "discord.js";
import { NeetEvent } from "../../lib";
import { writeDebug } from "../helpers/logger";

export default new NeetEvent<"debug">({
  name: Events.Debug,
  once: false,
  run: (message) => writeDebug(message),
});
