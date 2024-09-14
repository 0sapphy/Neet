process.loadEnvFile(".env");
const args = process.argv.slice(2);
if (!args) console.info(`[SCRIPT]: No command arg found...`);

/*
$cmd=emojis-sync
$desc=Save updated emojis to a file. 
$1 Should only be ran after emoji data has either been:
$2 updated/deleted/created
*/
if (args[0] === "emojis-sync") {
  (async () => {
    console.log(`[SYNC]: Started fetcing data...`);

    const res = await fetch(
      `https://discord.com/api/applications/${process.env.ID}/emojis`,
      {
        method: "GET",
        headers: { Authorization: `Bot ${process.env.TOKEN}` },
      },
    );

    const data = await res.json();
    const file_data = {};

    console.log(`[SYNC]: Assigning emoji data...`);

    for (const emoji of data.items) {
      Object.assign(file_data, { [emoji.name]: emoji });
      console.log(`[SYNC]: Assigned emoji data for: ${emoji.name}`);
    }

    require("node:fs/promises")
      .writeFile("./src/lib/emojis.json", JSON.stringify(file_data, null, 2))
      .then(() => console.log("[SYNC]: Saved emoji data to file."))
      .catch((reason) => console.error(`[SYNC]: Error at writeFile`, reason));

    console.log(`[SYNC]: Completed emoji sync.`);
  })();

  return 1;
}
