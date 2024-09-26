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

    whitelist: {
      type: [mongoose.SchemaTypes.String],
      default: [],
    },
  },
});

module.exports = mongoose.model("guilds", GuildSchema, "Guilds");
