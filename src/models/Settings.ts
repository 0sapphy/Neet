import {
  getModelForClass,
  modelOptions,
  Passthrough,
  prop,
  ReturnModelType,
  Severity,
} from "@typegoose/typegoose";
import { QueryOptions } from "mongoose";

export function UTILMakeUpdatable(object: UpdateQueryAnyGreeting) {
  const makeProperty = (prop: string): string => `${object.prefix}.${prop}`;
  const data = {};

  if (object.channelId != undefined)
    Object.assign(data, { [makeProperty("channelId")]: object.channelId });
  if (object.enabled != undefined)
    Object.assign(data, { [makeProperty("enabled")]: object.enabled });

  if (object.options != undefined) {
    for (const key of Object.keys(object.options)) {
      Object.assign(data, {
        //@ts-expect-error Index Type Error
        [makeProperty(`options.${key}`)]: object.options[key],
      });
    }
  }

  return data;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class SettingClass {
  @prop({ required: true })
  public guildId!: string;

  @prop({ default: { enabled: false, channelId: null } })
  public welcome?: {
    enabled: boolean;
    channelId: string;
    options: MessageOptionClass;
  };

  @prop({ default: { enabled: false, channelId: null } })
  public farewell?: {
    enabled: boolean;
    channelId: string;
    options: MessageOptionClass;
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

export class MessageOptionClass {
  @prop({ type: () => String, default: null })
  public content?: string;

  @prop({
    type: () => new Passthrough({ name: String, iconURL: String }, true),
    default: { name: null, iconURL: null },
  })
  public author?: {
    name: string;
    iconURL: string;
  };

  @prop({ type: () => String })
  public title?: string;

  @prop({ type: () => String })
  public description?: string;
}

export interface UpdateQueryAnyGreeting {
  enabled?: boolean;
  channelId?: string | null;
  options?: UpdateQueryMessageOption;
  prefix?: string;
}

export interface UpdateQueryMessageOption {
  content: string;
  title?: string | null;
  description?: string | null;
  author?: { name?: string | null; iconURL?: string | null };
}

export const Setting = getModelForClass(SettingClass, {
  options: { customName: "Settings" },
  schemaOptions: { validateBeforeSave: true },
});
