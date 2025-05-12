import fs from "node:fs";
import { logger } from "../../";
import { box } from "consola/utils";
import { ValidatorFunctionResult } from "../utils";
import { CLIENT_ID, DATABASE, TOKEN } from "./types";

export async function ValidateProcessEnv(): Promise<ValidatorFunctionResult> {
	const DotEnv = fs.existsSync(".env");

	if (!DotEnv) {
		logger.fatal(new Error("Path .env file not found."));

		return {
			completed: false,
			failedAt: "env::file",
			exit: true
		};
	}

	process.loadEnvFile(".env");
	CLIENT_ID.parse(process.env.CLIENT_ID, { path: ["VPE:CLIENT_ID::001"] });
	TOKEN.parse(process.env.TOKEN, { path: ["VPE:TOKEN::002"] });
	DATABASE.parse(process.env.DATABASE, { path: ["VPE:DATABASE::003"] });

	logger.log(box(`Successfully validated (.env) variables.`));

	return {
		completed: true
	};
}
