/* eslint-disable @typescript-eslint/no-explicit-any */

import { LoggerMap, LoggerNamespace, LoggerOptions } from "./types.logger";
import { basicLevel, error, warn } from "./functions";

export function createLogger<const Namespaces extends readonly string[]>(
	namespaces: Namespaces,
	options?: LoggerOptions
): LoggerMap<Namespaces> {
	const logger = {} as Record<Namespaces[number], LoggerNamespace>;

	for (const ns of namespaces) {
		const name = ns as Namespaces[number];

		logger[name] = {
			debug: (...args: any[]) => basicLevel(name, "DEBUG", ...args),
			info: (...args: any[]) => basicLevel(name, "INFO", ...args),
			warn: (...args: any[]) => warn(name, ...args),
			error: (...args: any[]) => error(name, options, ...args),
			write: (...args: any[]) => error(name, options, ...args)
		};
	}

	return logger;
}
