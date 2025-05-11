/* eslint-disable @typescript-eslint/no-explicit-any */

import ansi from "ansi-colors";
import Path from "node:path";
import fs from "node:fs";
import { inspect } from "node:util";
import { LoggerOptions } from "./types.logger";
import { createLogger } from "../Logger/index";
import { codeBlock } from "discord.js";

const logger = createLogger(["system"]);

function getColorForNamespace(namespace: string) {
	const colors = {
		"system": "redBright",
		"client": "cyanBright",
		"mongodb": "greenBright",
		"validator": "redBright",
		"validator:processenv": "yellowBright"
	} as any;

	return colors[namespace];
}

export function basicLevel(namespace: string, level: string, ...args: any[]) {
	console.info(
		//@ts-expect-error Type Error
		"[" + ansi[getColorForNamespace(namespace)](namespace) + "]:",
		ansi.bold.underline(level.toUpperCase()),
		...args
	);
}

export function warn(namespace: string, ...args: any[]) {
	console.info(
		//@ts-expect-error Type Error
		"[" + ansi[getColorForNamespace(namespace)](namespace) + "]:",
		ansi.bold.underline("WARN"),
		args.length < 1 ? args.at(0) : inspect(args, { colors: true })
	);
}

export function error(namespace: string, options?: LoggerOptions, ...args: any[]) {
	console.info(
		//@ts-expect-error Type Error
		"[" + ansi[getColorForNamespace(namespace)](namespace) + "]:",
		ansi.bold.underline("ERROR"),
		inspect(args, { colors: true })
	);

	if (options) {
		if (!options.errors.save) return;
		let path = options.errors.save;

		if (!Array.isArray(options.errors.save)) path = Path.resolve(options.errors.save);

		write(namespace, path, ...args);
	}
}

export async function write(namespace: string, path: string | string[], ...args: any[]) {
	try {
		const date = new Date();

		const data = `\n> Error - ${namespace}\n${codeBlock(inspect(args, { colors: true }))}`;

		fs.writeFileSync(`${path}/${date.getDate()}-${date.getHours()}.md`, data);
	} catch (error) {
		logger.system.error(error);
	}
}
