/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSONEncodable,
  RestOrArray,
  normalizeArray,
  ApplicationCommandType,
  InteractionContextType,
} from "discord.js";
import { NeetCommandOptionBuilder } from "./OptionBuilder";
import {
  INeetCommandBuilder,
  INeetCommandData,
  IRawAPICommandData,
} from "../Types/neet";

function isBuilder<Builder extends JSONEncodable<any>>(
  builder: unknown,
  Constructor: new () => Builder,
): builder is Builder {
  return builder instanceof Constructor;
}

export function resolveBuilder<
  Builder extends JSONEncodable<any>,
  BuilderData extends Record<PropertyKey, any>,
>(
  builder: Builder | BuilderData | ((builder: Builder) => Builder),
  Constructor: new (data?: BuilderData) => Builder,
): Builder {
  if (isBuilder(builder, Constructor)) {
    return builder;
  }

  if (typeof builder === "function") {
    return builder(new Constructor());
  }

  return new Constructor(builder);
}

export class NeetCommandBuilder {
  protected handler: INeetCommandBuilder;
  protected data: IRawAPICommandData;

  public constructor(builder: INeetCommandData) {
    this.handler ??= {};
    this.data = {
      type: builder.type ? builder.type : ApplicationCommandType.ChatInput,
      application_id: process.env.CLIENT_ID,
      contexts: builder.contexts
        ? builder.contexts
        : [InteractionContextType.Guild],
      default_member_permissions: builder.default_member_permissions
        ? builder.default_member_permissions
        : null,

      name: builder.name,
      description: builder.description,

      options: builder.options,
      nsfw: builder.nsfw,
    };
  }

  addHandlerOptions(
    ...input: RestOrArray<
      | NeetCommandOptionBuilder
      | ((option: NeetCommandOptionBuilder) => NeetCommandOptionBuilder)
    >
  ) {
    const normalized = normalizeArray(input);
    const result = normalized
      .map((builder) =>
        //@ts-expect-error
        resolveBuilder(builder, NeetCommandOptionBuilder),
      )
      .at(0);

    this.handler ??= {};
    //@ts-expect-error
    this.handler = result.handler;

    return this;
  }
}
