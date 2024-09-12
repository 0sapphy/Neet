const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },

  channel: {
    onCreate: {
      type: mongoose.SchemaTypes.String,
      default: null,
    },

    onUpdate: {
      type: mongoose.SchemaTypes.String,
      default: null,
    },

    onDelete: {
      type: mongoose.SchemaTypes.String,
      default: null,
    },
  },
});

module.exports = mongoose.model("Event Logging Data", Schema, "Log");
