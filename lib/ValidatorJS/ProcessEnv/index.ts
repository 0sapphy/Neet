import fs from "node:fs";
import { logger, ValidatorFunctionResult } from "../utils";
import { CLIENT_ID, DATABASE, TOKEN } from "./types";

export function ValidateProcessEnv(): ValidatorFunctionResult {
	logger["validator:processenv"].debug("Checking if .env exists...");

	const envFile = fs.existsSync(".env");

	if (!envFile) {
		logger["validator:processenv"].error(new Error("Path .env file not found."));
		return {
			completed: false,
			failedAt: "env::file",
			exit: true
		};
	}

	process.loadEnvFile(".env");

	logger["validator:processenv"].debug("Validating environment variables...");
	CLIENT_ID.parse(process.env.CLIENT_ID, { path: ["VPE:CLIENT_ID::001"] });
	TOKEN.parse(process.env.TOKEN, { path: ["VPE:TOKEN::002"] });
	DATABASE.parse(process.env.DATABASE, { path: ["VPE:DATABASE::003"] });

	return {
		completed: true
	};
}
