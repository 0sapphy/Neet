export interface FilterProps {
  guildId?: string;
  userId?: string;
}

// Function Types.

export interface CaseData {
  case_id?: string;
  guild_id: string;
  moderator_id: string;
  user_id?: string;
  action: CaseActions;
  reason: string;
}

// Enums
export enum CaseActions {
  BAN = "ban",
  KICK = "kick",
  WARN = "warn",
}
