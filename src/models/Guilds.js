const { default: mongoose } = require("mongoose");

const GuildSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },

  settings_moderation_roles: {
    type: mongoose.SchemaTypes.Array,
  },
});

module.exports = mongoose.model("guilds", GuildSchema, "Guilds");
