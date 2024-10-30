/** @format */

import { PermissionsBitField } from "discord.js";

export function bitFieldToString(value: bigint[]) {
	return new PermissionsBitField(value).toArray();
}
