import { createConsola, LogLevels } from "consola";

export * from "./DiscordJS/Client";
export * from "./ValidatorJS/index";

export const logger = createConsola({
	level: LogLevels.trace,
	fancy: true,
	formatOptions: {
		colors: true,
		date: true,
		compact: true
	}
});
