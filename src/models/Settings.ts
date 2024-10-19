import {
  getModelForClass,
  Passthrough,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import { QueryOptions } from "mongoose";

function UTILMakeUpdatable(object: UpdateQueryAnyGreeting) {
  const makeProperty = (prop: string): string => `${object.prefix}.${prop}`;
  const data = {};

  if (object.channelId != undefined)
    Object.assign(data, { [makeProperty("channelId")]: object.channelId });
  if (object.enabled != undefined)
    Object.assign(data, { [makeProperty("enabled")]: object.enabled });

  return data;
}

export class SettingClass {
  @prop({ required: true })
  public guildId!: string;

  @prop({
    type: () => new Passthrough({ enabled: Boolean, channelId: String }, true),
    default: { enabled: false, channelId: null },
  })
  public welcome?: {
    enabled: boolean;
    channelId: string;
  };

  @prop({
    type: () => new Passthrough({ enabled: Boolean, channelId: String }, true),
    default: { enabled: false, channelId: null },
  })
  public farewell?: {
    enabled: boolean;
    channelId: string;
  };

  static async UPDATEFarewell(
    this: ReturnModelType<typeof SettingClass>,
    guildId: string,
    update: UpdateQueryAnyGreeting,
    options?: QueryOptions<SettingClass>,
  ) {
    options ??= { upsert: true, new: true };
    update.prefix = "farewell";
    return (
      await this.findOneAndUpdate(
        { guildId },
        UTILMakeUpdatable(update),
        options,
      )
    )?.farewell;
  }

  static async UPDATEWelcome(
    this: ReturnModelType<typeof SettingClass>,
    guildId: string,
    update: UpdateQueryAnyGreeting,
    options?: QueryOptions<SettingClass>,
  ) {
    options ??= { upsert: true, new: true };
    update.prefix = "welcome";
    return (
      await this.findOneAndUpdate(
        { guildId },
        UTILMakeUpdatable(update),
        options,
      )
    )?.welcome;
  }
}

interface UpdateQueryAnyGreeting {
  enabled?: boolean;
  channelId?: string;
  prefix?: string;
}

export const Setting = getModelForClass(SettingClass, {
  options: { customName: "Settings" },
  schemaOptions: { validateBeforeSave: true },
});
