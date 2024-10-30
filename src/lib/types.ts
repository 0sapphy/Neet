/** @format */

import { SlashCommandBuilder } from "discord.js";

export enum PermissionTypes {
	Command = 0,
	Subcommand = 1,
	Group = 2
}

export interface IPermissions {
	type: number;

	// if #type is 1 #context has to be a Subcommand name;
	// if #type is 2 #context has to be a Group name;
	context?: string;

	// if #type is 2 this is required;
	items?: {
		name: string;
		member?: bigint[];
		client?: bigint[];
	}[];

	// if #type is 0 this is required, no other option is needed;
	// if #type is 1 this is required, with #context being Subcommand name;
	member?: bigint[];
	client?: bigint[];
}

export interface ICommandOptions {
	permissions?: IPermissions[];
}

export interface IPath {
	for: string | null;
	path: string | null;
}

export interface ICommand {
	paths: IPath[];
	data: SlashCommandBuilder;
	options?: ICommandOptions;
}
