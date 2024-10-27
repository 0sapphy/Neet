import signale from "signale";
import { NeetEvent } from "../../lib";

export default new NeetEvent<"debug">({
  name: "cl-debug",
  once: false,
  run: (message) => signale.debug({ prefix: `[PROGRAM]`, message })
});
