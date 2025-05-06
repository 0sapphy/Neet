import { ChatInputCommandInteraction, ClientEvents, Message, PermissionsString, SlashCommandBuilder } from "discord.js";
import { Neet } from "./Client";

/** Event structure.  */
export interface EventStructure<Name extends keyof ClientEvents = void> {
	name: keyof ClientEvents;
	type: "on" | "once";
	run: (...args: ClientEvents[Name]) => void;
}

/** Slash command structure */
export interface SlashCommandStructure {
	data: SlashCommandBuilder;
	run: (interaction: ChatInputCommandInteraction, context: CommandContext) => void;
}

/** Message command related structures. */
export interface MessageCommandPermissionsStructure {
	serverOwnerOnly?: boolean;
	serverAdminsOnly?: boolean;
	bot?: PermissionsString[];
	member?: PermissionsString[];
}

export interface MessageCommandStructure {
	name: string;
	aliases?: string[];
	options?: {
		onlyFor?: string[];
		botAdminOnly?: boolean;
		permissions?: MessageCommandPermissionsStructure;
	};
	run: (message: Message, context: CommandContext) => void;
}

/** General Command Context. */
export interface CommandContext {
	client: Neet<true>;
}
