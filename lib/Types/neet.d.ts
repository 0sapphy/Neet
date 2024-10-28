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
  name: keyof ClientEvents | string;
  once?: boolean;
  run: (...args: ClientEvents[N]) => void;
}

// Parser 

export interface IParsed {
  I?: string | boolean | number;
  S?: string | boolean | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  A?: any;
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
