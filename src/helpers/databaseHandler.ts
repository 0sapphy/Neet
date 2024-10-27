import mongoose from "mongoose";
import signale from "signale";

export function Database() {
  mongoose
  .connect(process.env.DATABASE)
  .then(() => signale.complete({ prefix: "[HANDLERS]", message: "Connected to mongodb." }))
  .catch((_r: Error) => signale.error({ prefix: "[HANDLERS]", message: `Error handling mongodb connection. ${_r}` }));
}
