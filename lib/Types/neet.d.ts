import {
  APIApplicationCommandOption,
  ApplicationCommandType,
  ClientEvents,
  PermissionsString,
  InteractionContextType,
  ChatInputCommandInteraction,
} from "discord.js";
import { CommandMode, CommandRunType } from "./enum";

// Event Types.

export interface INeetEvent<N = void> {
  name: keyof ClientEvents;
  once?: boolean;
  run: (...args: ClientEvents[N]) => void;
}

// Command Types.

export interface IRawAPICommandData {
  application_id?: string;
  type?: ApplicationCommandType;

  options?: APIApplicationCommandOption[];
  nsfw?: boolean;
  contexts: InteractionContextType[];

  default_member_permissions: string | null;
  name: string;
  description: string;
}

export interface INeetCommandData {
  type?: ApplicationCommandType;

  options?: APIApplicationCommandOption[];
  nsfw?: boolean;
  contexts?: InteractionContextType[];
  default_member_permissions?: string | null;
  name: string;
  description: string;
}

export interface INeetCommand {
  data: IRawAPICommandData;
  handler: INeetCommandBuilder;
  run?: (interaction: ChatInputCommandInteraction) => void;
}

export interface INeetCommandBuilder {
  user_permissions?: {
    required: PermissionsString[];
    message?: string;
  };

  client_permissions?: {
    required: PermissionsString[];
    message?: string;
  };

  mode?: CommandMode;
  run_type?: CommandRunType;
}

export interface INeetCommandBuilderOptions {
  user_permissions?: {
    required: PermissionsString[];
    message?: string;
  };

  client_permissions?: {
    required: PermissionsString[];
    message?: string;
  };
}
