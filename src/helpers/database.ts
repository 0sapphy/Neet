import { IFilterProperties } from "../../lib/Types/database";
import { writeError } from "./logger";

import Guilds, { IGuildCase } from "../models/Guilds";

function uniqueID(): string {
  return crypto.randomUUID();
}

// Fix types...
/*
export async function upsert(model: any, _data: FilterProps) {
  let data;
  let error = false;

  data = await model.findOne(_data).catch((err: Error) => {
    writeError(`#upsert()`, err);
    error = true;
  });

  if (!data)
    data = await model.create(_data).catch((err: Error) => {
      writeError("#upsert()", err);
      error = true;
    });

  return {
    data,
    error,
  };
}*/

export async function createCase(filter: IFilterProperties, options: IGuildCase) {
  // Assign values to data.
  Object.assign(options, { userId: filter.userId, caseId: uniqueID() });

  return await Guilds.findOneAndUpdate(
    filter,
    { $push: { cases: options } },
    { upsert: true, new: true },
  );
}
