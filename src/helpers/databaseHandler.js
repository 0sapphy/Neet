const { default: mongoose } = require("mongoose");
const { writeInfo, writeError } = require("./logger");

module.exports = () => {
  writeInfo("Connecting to MongoDB...");

  try {
    mongoose
      .connect(process.env.DATABASE)
      .then(() => writeInfo("Connected to MongoDB."))
      .catch((_r) => writeError("Error connecting to MongoDB", _r));
  } catch (error) {
    writeError("MongoDB Error", error);
  }
};
