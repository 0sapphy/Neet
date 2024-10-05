import { Events } from "discord.js";
import { NeetEvent } from "../../lib";

/* new NeetEvent<N>
 *               ^^^ > The event name, used for args.
 *  new NeetEvent(options)
 *                ^^^^^^^ > { name: typeof Events, once?: boolean, run: (...args: ClientEvents[N]) => {} }
 */
export default new NeetEvent<"ready">({
  name: Events.ClientReady,
  once: true,
  run: (client) => {
    console.log(client.user.username);
  },
});
