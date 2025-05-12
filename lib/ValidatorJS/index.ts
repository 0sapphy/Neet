import { EventEmitter } from "node:events";
import { ValidateProcessEnv } from "./ProcessEnv";
import { logger } from "../";

export class Validator extends EventEmitter {
	public validators = 1;
	public completed = 0;

	public constructor() {
		super({ captureRejections: true });

		this.on("complete", (completed: boolean, params: [], err?: { failedAt: string; exit: boolean }) => {
			if (!completed) {
				logger[err?.exit ? "fatal" : "warn"](`Failed validation check at ${params.at(1)} >> ${err?.failedAt}`);
				if (err?.exit) process.exit(1);
				return;
			}

			this.completed = params.at(0)!;

			if (this.validators === this.completed) {
				logger.success("Completed all the validators without major issues.");
			} else {
				logger.success(`Completed ${params.at(1)} validator without major issues.`);
			}
		});
	}

	public async parseEnv() {
		const result = await ValidateProcessEnv();
		this.emit("complete", result.completed, [1, "env"], { failedAt: result.failedAt, exit: result.exit });
	}
}
