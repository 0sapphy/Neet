import {
  getModelForClass,
  modelOptions,
  Passthrough,
  prop,
  ReturnModelType,
  Severity,
} from "@typegoose/typegoose";
import { QueryOptions } from "mongoose";

export function MakeUpdateable(object: UpdateQueryAnyGreeting) {
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
export class SettingSchema {
  @prop({ required: true })
  public guildId!: string;

  @prop({ default: { enabled: false, channelId: null } })
  public welcome?: {
    enabled: boolean;
    channelId: string;
    options: MessageOptionSchema;
  };

  @prop({ default: { enabled: false, channelId: null } })
  public farewell?: {
    enabled: boolean;
    channelId: string;
    options: MessageOptionSchema;
  };

  static async GetOrCreate(
    this: ReturnModelType<typeof SettingSchema>, 
    guildId: string
  ) {
    let data; 
    data = await this.findOne({ guildId });
    if (!data) {
      data = await this.create({ guildId });
      await data.save();
    }

    return data;
  }

  static async UpdateFarewell(
    this: ReturnModelType<typeof SettingSchema>,
    guildId: string,
    update: UpdateQueryAnyGreeting,
    options?: QueryOptions<SettingSchema>,
  ) {
    options ??= { upsert: true, new: true };
    update.prefix = "farewell";
    return (
      await this.findOneAndUpdate({ guildId }, MakeUpdateable(update), options)
    )?.farewell;
  }

  static async UpdateWelcome(
    this: ReturnModelType<typeof SettingSchema>,
    guildId: string,
    update: UpdateQueryAnyGreeting,
    options?: QueryOptions<SettingSchema>,
  ) {
    options ??= { upsert: true, new: true };
    update.prefix = "welcome";
    return (
      await this.findOneAndUpdate({ guildId }, MakeUpdateable(update), options)
    )?.welcome;
  }
}

export class MessageOptionSchema {
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

export const Setting = getModelForClass(SettingSchema, {
  options: { customName: "Settings" },
  schemaOptions: { validateBeforeSave: true },
});
