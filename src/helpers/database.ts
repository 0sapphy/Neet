import { IFilterProperties } from "../../lib/Types/database";
import Guilds, {
  IModerationCase,
  EnumModerationCaseFilterProperties,
} from "../models/Guilds";
import Settings, { ISetWelcome } from "../models/Settings";
import { writeError } from "./logger";

/* (**GUILD SETTING HELPERS**) (2024.10.13) */

export async function updateWelcome(guildId: string, update: ISetWelcome) {
  try {
    const updateObj = {};
    if (update.enabled != undefined)
      Object.assign(updateObj, { "welcome.enabled": update.enabled });
    if (update.channelId != undefined)
      Object.assign(updateObj, { "welcome.channelId": update.channelId });

    const data = await Settings.findOneAndUpdate({ guildId }, updateObj, {
      upsert: true,
      new: true,
    });

    return data.welcome;
  } catch (error) {
    writeError("updateWelcome", error);
  }
}

/* (**DB HELPER FUNCTIONS**) (2024.10.13) */

export function createDefaults(type: string, filter: IFilterProperties) {
  if (type === "guild") {
    const object = {
      guildId: "r-v",
      cases: [],
    };

    return replaceDefaultFilters(filter, object);
  } else if (type === "setting") {
    const object = {
      guildId: "r-v",
      welcome: { enabled: false, channelId: null },
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

/* (**CASE HELPER FUNCTIONS**) (**2024.10.13**) */

export async function getCases(
  guildId: string,
  filterBy: EnumModerationCaseFilterProperties,
  equalsTo: string,
): Promise<IModerationCase[] | false> {
  const cases: IModerationCase[] = [];
  const data = await Guilds.findOne({ guildId });

  // * If no case in guild return false;
  if (!data?.cases) return false;

  // * If no cases for this user return false;
  if (data.cases.filter(($) => $[filterBy] === equalsTo).length < 1)
    return false;

  for (const _case of data.cases.filter(($) => $[filterBy] === equalsTo)) {
    cases.push(_case);
  }

  return cases;
}

export async function createCase(
  filter: IFilterProperties,
  options: IModerationCase,
) {
  Object.assign(options, { caseId: crypto.randomUUID() });
  return await Guilds.findOneAndUpdate(
    filter,
    { $push: { cases: options } },
    { upsert: true, new: true },
  );
}
