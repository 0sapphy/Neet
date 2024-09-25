const { default: mongoose } = require("mongoose");

const GuildSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("guilds", GuildSchema, "Guilds");
