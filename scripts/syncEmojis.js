process.loadEnvFile("../.env");

(async () => {
  console.info("[NEET]: Loading...");

  const discord_api = "https://discord.com/api";

  console.info("[NEET]: Fetching emojis in dev guild.");

  const res = await fetch(
    `${discord_api}/guilds/${process.env.GUILD_ID}/emojis`,
    {
      method: "GET",
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
      },
    },
  );

  console.info("[NEET]: Fetched emojis...");

  const data = await res.json();

  console.info(`[NEET]: Loaded ${data.length} emojis.`);

  const file_data = {};

  console.info("[NEET]: Assign emoji data...");

  for (const emoji of data) {
    console.info(`[NEET]: Assigning ${emoji.name}...`);

    Object.assign(file_data, {
      [emoji.name]: emoji,
    });
  }

  console.info(`[NEET]: Saving emoji data to emojis.json`);

  require("node:fs/promises")
    .writeFile("../scripts/dev/emojis.json", JSON.stringify(file_data, null, 1))
    .then(() => {
      console.info(`[NEET]: Saved ${data.length} emojis to emojis.json`);
    })
    .catch((_) => {
      console.error(`[NEET]: Error saving emojis to emojis.json`, _);
    });
})();
