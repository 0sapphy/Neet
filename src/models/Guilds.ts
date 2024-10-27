import { getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";
import { FilterOutFunctionKeys } from "@typegoose/typegoose/lib/types";
import { randomUUID } from "node:crypto";

export class GuildClass {
  @prop({ required: true })
  public guildId!: string;

  @prop({ type: () => [ModerationCaseClass] })
  cases?: ModerationCaseClass[];

  public static async deleteAndCreate(
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

  public static async createCase(
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

  public static async getUserCases(
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

  public static async getCases(
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
