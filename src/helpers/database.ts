import { IFilterProperties } from "../../lib/Types/database";
import Guilds, { IGuildCase } from "../models/Guilds";

function uniqueID(): string {
  return crypto.randomUUID();
}

export async function getCases(filter: IFilterProperties): Promise<IGuildCase[]|false> {
  const cases: IGuildCase[] = [];
  const data = await Guilds.findOne({ guildId: filter.guildId });

  // * If no case in guild return false;
  if (!data?.cases) return false;

  // * If no cases for this user return false;
  if (data.cases.filter(_ => _.userId === filter.userId).length < 1) return false;

  for (const _case of data.cases.filter(_ => _.userId === filter.userId)) {
    cases.push(_case);
  }

  return cases;
}

export async function createCase(filter: IFilterProperties, options: IGuildCase) {
  // Assign values to data.
  Object.assign(options, { caseId: uniqueID() });

  return await Guilds.findOneAndUpdate(
    filter,
    { $push: { cases: options } },
    { upsert: true, new: true },
  );
}
