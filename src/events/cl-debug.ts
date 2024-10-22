import { NeetEvent } from "../../lib";
import { writeDebug } from "../helpers/logger";

export default new NeetEvent<"debug">({
  name: "cl-debug",
  once: false,
  run: (message) => writeDebug(message)
});
