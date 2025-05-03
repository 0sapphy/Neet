/* eslint-disable @typescript-eslint/no-explicit-any */

export type LoggerMethods = "debug" | "info" | "warn" | "error" | "write";

export type LoggerNamespace = Record<LoggerMethods, (...args: any[]) => void>;

export type LoggerMap<Namespaces extends readonly string[]> = Record<Namespaces[number], LoggerNamespace>;

export interface LoggerOptions {
	errors: {
		save: string | string[];
	};
}
