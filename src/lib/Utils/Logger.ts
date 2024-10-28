// @deno-types="npm:@types/signale"
import signale from "npm:signale";

export const Bot = new signale.Signale({
	scope: "BOT",

	config: {
		displayBadge: true,
		displayDate: true,
	},
});

export const Debug = new signale.Signale(
	{
		scope: "DEBUG",

		config: {
			displayBadge: true,
			displayDate: true,
		},

		types: {
			DiscordJS: {
				badge: "🤖",
				label: "DiscordJS",
				color: "purple",
			},

			Process: {
				badge: "💾",
				label: "Process",
				color: "yellow",
			},
		},
	},
);
