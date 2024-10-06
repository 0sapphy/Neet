
import mongoose from "mongoose"

const GuildSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },

  automod_links_invite: {
    enabled: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },

    action: {
      type: mongoose.SchemaTypes.String,
      default: "warn",
    },

    imune_roles: {
      type: [mongoose.SchemaTypes.String],
      default: null,
    },

    whitelist: {
      type: [mongoose.SchemaTypes.String],
      default: null,
    },
  },
});

export const Guilds = mongoose.model("guilds", GuildSchema, "Guilds");
