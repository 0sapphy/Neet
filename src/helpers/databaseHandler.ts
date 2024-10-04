import mongoose from "mongoose";
import { writeInfo, writeError } from "./logger";

export function Database() {
  writeInfo("Connecting to MongoDB...");

  try {
    mongoose
      .connect(process.env.DATABASE)
      .then(() => writeInfo("Connected to MongoDB."))
      .catch((_r: Error) => writeError("Error connecting to MongoDB", _r));
  } catch (error) {
    writeError("MongoDB Error", error);
  }
}
