import mongoose from "mongoose";

export default mongoose.model(
  "Settings",
  new mongoose.Schema({
    guildId: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },

    welcome: {
      enabled: mongoose.SchemaTypes.Boolean,
      channelId: mongoose.SchemaTypes.String,
    },
  }),
);

export interface ISetWelcome {
  enabled?: boolean;
  channelId?: string;
}