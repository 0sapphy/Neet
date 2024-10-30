/** @format */

import { Debug } from "../../lib";

export default {
	name: "uncaughtException",
	type: "process",
	once: false,
	run: (error: Error) => {
		Debug.fatal(error);
	}
};
