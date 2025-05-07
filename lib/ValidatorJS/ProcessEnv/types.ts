/* eslint-disable no-useless-escape */
import { z } from "zod";

export const CLIENT_ID = z
	.string({
		required_error: "ENV:CLIENT_ID is a required variable, not found in .env!",
		invalid_type_error: "ENV:CLIENT needs to be typeof string"
	})
	.min(17, "THIS >= 17")
	.max(19, "THIS =< 19");
export const TOKEN = z
	.string({
		required_error: "ENV:TOKEN is a reauired variable, not found in .env!",
		invalid_type_error: "ENV:TOKEN needs to be typeof string"
	})
	.regex(/^([MN][\w-]{23,25})\.([\w-]{6})\.([\w-]{27,39})$/gm, "Invalid Token");
export const DATABASE = z
	.string({ invalid_type_error: "ENV:DATABASE needs to be typeof string" })
	.regex(
		/mongodb?(\+srv):\/\/(?:(?<login>[^\:\/\?\#\[\]\@]+)(?::(?<password>[^\:\/\?\#\[\]\@]+))?@)?(?<host>[\w\.\-]+(?::\d+)?(?:,[\w\.\-]+(?::\d+)?)*)(?:\/(?<dbname>[\w\.\-]+))?(?:\?(?<query>[\w\.\-]+=[\w\.\-]+(?:&[\w\.\-]+=[\w.\-]+)*))?$/,
		"Invalid MongoDB connection URI"
	)
	.optional();
