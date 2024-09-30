const { default: mongoose } = require("mongoose");

const GuildSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },

  automod_links_invite: {
    enabled: {
      type: mongoose.SchemaTypes.String,
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

module.exports = mongoose.model("guilds", GuildSchema, "Guilds");
