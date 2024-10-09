import { Events } from "discord.js";
import { NeetEvent } from "../../lib";
import { writeInfo } from '../helpers/logger'

/* new NeetEvent<N>
 *               ^^^ > The event name, used for args.
 *  new NeetEvent(options)
 *                ^^^^^^^ > { name: typeof Events, once?: boolean, run: (...args: ClientEvents[N]) => {} }
 */
export default new NeetEvent<"ready">({
  name: Events.ClientReady,
  once: true,
  run: (client) => {
    writeInfo(client.user.username);
  },
});
