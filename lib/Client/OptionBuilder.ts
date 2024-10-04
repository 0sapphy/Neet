import { PermissionsString } from "discord.js";
import { CommandMode } from "../Types/enum";
import { INeetCommandBuilder } from "../Types/neet";

export class NeetCommandOptionBuilder {
  protected handler: INeetCommandBuilder;

  public constructor(options?: INeetCommandBuilder) {
    this.handler = options ? options : { mode: CommandMode.UNRECORDED };
  }

  setMode(mode: CommandMode) {
    this.handler ??= {};
    this.handler.mode = mode;

    return this;
  }

  setUserPermissions(permissions: PermissionsString[]) {
    this.handler ??= {};
    this.handler.user_permissions = { required: permissions };

    return this;
  }

  setClientPermissions(permissions: PermissionsString[]) {
    this.handler ??= {};
    this.handler.client_permissions = { required: permissions };
    return this;
  }
}
