require("./lib/setup");
process.loadEnvFile(".env");
const { LogLevel, SapphireClient } = require("@sapphire/framework");
const { GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");

const client = new SapphireClient({
  logger: {
    level: LogLevel.Info,
  },

  shards: "auto",
  intents: [
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
  ],
});

const main = async () => {
  try {
    client.logger.debug("Connecting to mongoDB");

    mongoose
      .connect(process.env.DATABASE)
      .then(() => {
        client.logger.info("Connected to mongoDB");
      })
      .catch((reason) => client.logger.error(reason));

    await client.login(process.env.TOKEN);
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
    process.exit(1);
  }
};

main();
