import { getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";
import { FilterOutFunctionKeys } from "@typegoose/typegoose/lib/types";
import { UpdateQuery, QueryOptions } from "mongoose";
import { randomUUID } from "node:crypto";

export class GuildClass {
  @prop({ required: true })
  public guildId!: string;

  @prop({ type: () => [ModerationCaseClass] })
  cases?: ModerationCaseClass[];

  public static async GET(
    this: ReturnModelType<typeof GuildClass>,
    guildId: string,
    upsert?: boolean,
  ) {
    if (upsert === undefined) upsert = false;
    let data;
    data = await this.findOne({ guildId });
    if (!data && upsert === true) {
      data = await this.create({ guildId });
      await data.save();
    }

    return data;
  }

  public static async UPDATE(
    this: ReturnModelType<typeof GuildClass>,
    guildId: string,
    update: UpdateQuery<GuildClass>,
    options?: QueryOptions<GuildClass> & {
      includeResultMetadata: true;
      lean: true;
    },
  ): Promise<GuildClass | null> {
    return await this.findOneAndUpdate({ guildId }, update, options);
  }

  public static async RESET(
    this: ReturnModelType<typeof GuildClass>,
    guildId: string,
    create?: boolean,
  ) {
    if (create === undefined) create = true;
    let data;
    data = await this.deleteOne({ guildId });
    if (data.acknowledged && create === true) {
      data = await this.create({ guildId });
      await data.save();
    }
    return data;
  }

  public static async CREATEcase(
    this: ReturnModelType<typeof GuildClass>,
    guildId: string,
    caseInfo: FilterOutFunctionKeys<ModerationCaseClass>,
    upsert?: boolean,
  ) {
    if (upsert === undefined) upsert = false;
    return this.findOneAndUpdate(
      { guildId },
      { $push: { cases: [caseInfo] } },
      { upsert, new: true },
    );
  }

  public static async GETcasesForUser(
    this: ReturnModelType<typeof GuildClass>,
    guildId: string,
    userId: string,
  ): Promise<ModerationCaseClass[] | false> {
    const guild = await this.findOne({ guildId });
    if (!guild || !guild.cases) return false;
    const cases = guild.cases.filter((_case) => _case.userId === userId);
    if (cases === undefined) return false;
    return cases;
  }

  public static async GETcasesFiltered(
    this: ReturnModelType<typeof GuildClass>,
    guildId: string,
    filterBy: string,
    eqto: ModerationCaseFilters,
  ): Promise<ModerationCaseClass[] | false> {
    const guild = await this.findOne({ guildId });
    if (!guild || !guild.cases) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cases = guild.cases.filter(($: any) => $[filterBy] === eqto);
    if (cases === undefined) return false;
    return cases;
  }
}

export class ModerationCaseClass {
  @prop({ required: true })
  public userId!: string;

  @prop({ required: true })
  public moderatorId!: string;

  @prop({ default: randomUUID() })
  public caseId?: string;

  @prop({ type: () => String, required: true })
  public actionType!: string;

  @prop({ default: "No Reason Provided." })
  public reason?: string;
}

export enum ModerationCaseActions {
  Ban = "ban",
  Kick = "kick",
  Warn = "warn",
}

enum ModerationCaseFilters {
  userId = "userId",
  moderatorId = "moderatorId",
  caseId = "caseId",
}

export const Guild = getModelForClass(GuildClass, {
  options: { customName: "Guild" },
  schemaOptions: { validateBeforeSave: true },
});
