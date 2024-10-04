import { CaseData, FilterProps } from "../../lib/Types/database";
import { writeError } from "./logger";

import { Users } from "../models/Users";

function uniqueID(): string {
  return crypto.randomUUID();
}

// Fix types...
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
}

export async function createCase(
  userId: string,
  data: CaseData,
  options = { upsert: true, new: true },
) {
  // Assign values to data.
  Object.assign(data, { user_id: userId, case_id: uniqueID() });

  return await Users.findOneAndUpdate(
    { userId },
    { $push: { cases: data } },
    options,
  );
}
