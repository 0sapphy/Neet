/** @format */

import { ColorResolvable, EmbedBuilder } from "discord.js";
import { z } from "zod";

const EmbedOptions = z.object({
	prefix: z.string().default("You").optional(),
	color: z.string().default("Orange").optional(),
	timestamp: z.boolean().default(true).optional()
});

type TEmbedOptions = z.infer<typeof EmbedOptions>;

export function permissionsWarning(missing: string | string[], _options?: TEmbedOptions) {
	const options = EmbedOptions.parse(_options);
	const color = options.color as ColorResolvable;
	console.log(options, color);

	const embed = new EmbedBuilder()
		.setTitle(":x: | Missing Permissions")
		.setDescription(
			`${options.prefix} need these permissions to run this interaction.\n\n**»»»** Permissions: ${Array.isArray(missing) ? `[**${missing.length}**]` : ""}\n${Array.isArray(missing) ? missing.join(", ") : missing}`
		)
		.setColor(color ?? "Orange");

	if (options.timestamp != false) embed.setTimestamp();
	return embed;
}
