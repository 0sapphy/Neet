export interface IFilterProperties {
  guildId?: string;
  userId?: string;
}

// Function Types.

export interface CaseData {
  case_id?: string;
  guild_id: string;
  moderator_id: string;
  user_id?: string;
  action: ActionTypes;
  reason: string;
}

// Enums
export enum ActionTypes {
  BAN = 0,
  KICK = 1,
  WARN = 2,
  AUTO_MODERATION = 3,
}
