import { IFilterProperties } from "../../lib/Types/database";
import Guilds, { IGuildCase, IGuild } from "../models/Guilds";

export function createDefaults(type: string, filter: IFilterProperties) {
  if (type === "guild") {
    const object = {
      guildId: "r-v",
      settings: {
        welcome: { enabled: false, channel: null },
      },
      cases: [],
    };

    return replaceDefaultFilters(filter, object);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replaceDefaultFilters(filter: IFilterProperties, obj: any) {
  if (filter.guildId && obj.guildId) {
    return Object.assign(obj, { guildId: filter.guildId });
  }

  if (filter.userId && obj.userId) {
    return Object.assign(obj, { userId: filter.userId });
  }
}

export async function upsert(
  db: typeof Guilds,
  filter: IFilterProperties,
): Promise<IGuild> {
  let data;
  data = await db.findOne(filter);
  if (!data) data = (await db.create(filter)).save();
  //@ts-expect-error Type Error.
  return data;
}

function uniqueID(): string {
  return crypto.randomUUID();
}

export async function getCases(
  filter: IFilterProperties,
): Promise<IGuildCase[] | false> {
  const cases: IGuildCase[] = [];
  const data = await Guilds.findOne({ guildId: filter.guildId });

  // * If no case in guild return false;
  if (!data?.cases) return false;

  // * If no cases for this user return false;
  if (data.cases.filter((_) => _.userId === filter.userId).length < 1)
    return false;

  for (const _case of data.cases.filter((_) => _.userId === filter.userId)) {
    cases.push(_case);
  }

  return cases;
}

export async function createCase(
  filter: IFilterProperties,
  options: IGuildCase,
) {
  // Assign values to data.
  Object.assign(options, { caseId: uniqueID() });

  return await Guilds.findOneAndUpdate(
    filter,
    { $push: { cases: options } },
    { upsert: true, new: true },
  );
}
