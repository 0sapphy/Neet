/** @format */

import { Debug } from "../../lib";

export default {
	name: "unhandledRejection",
	type: "process",
	once: false,
	run: (reason: unknown, promise: Promise<unknown>) => {
		Debug.fatal(reason, promise);
	}
};
