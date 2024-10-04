import { INeetCommand, IRawAPICommandData } from "../lib/Types/neet";

process.loadEnvFile(".env");

import { Collection, REST, Routes } from "discord.js";
import { writeInfo } from "../src/helpers/logger";

export async function Deploy(commands: Collection<string, INeetCommand>) {
  const rest = new REST().setToken(process.env.TOKEN);

  writeInfo("Deploying (/) commands.");

  const data = await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    {
      body: parseData(commands),
    },
  );

  writeInfo("Deployed (/) commands.");

  return data;
}

function parseData(collection: Collection<string, INeetCommand>) {
  const data: IRawAPICommandData[] = [];
  collection.forEach((value) => {
    data.push(value.data);
  });

  return data;
}
