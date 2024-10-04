import mongoose from "mongoose";

const CasesSchema = new mongoose.Schema({
  case_id: {
    type: mongoose.SchemaTypes.UUID,
    required: true,
    unique: true,
  },

  guild_id: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  moderator_id: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  user_id: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },

  action: {
    type: mongoose.SchemaTypes.String,
    default: "warn",
  },

  reason: {
    type: mongoose.SchemaTypes.String,
  },
});

const UserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },

  cases: {
    type: [CasesSchema],
    default: [],
  },
});

export const Users = mongoose.model("users", UserSchema, "Users");
