import { createLogger } from "../Logger/index";

export const logger = createLogger(["validator", "validator:processenv"]);

export interface ValidatorFunctionResult {
	completed: boolean;
	failedAt?: string;
	exit?: boolean;
}
