import { ButtonInteraction } from "discord.js";
import { NeetButtonParameters } from "./NeetButtonParameters";

export interface IParameter {
  name: string;
  value: string;
}

interface IParseId {
  identifiers: {
    id: string;
    subId: string | undefined;
  };

  _parameters: IParameter[];
  parameters: NeetButtonParameters;
}

export class NeetButton {
  interaction: ButtonInteraction;

  public constructor(interaction: ButtonInteraction) {
    this.interaction = interaction;
  }

  /**
   * @example
   * setCustomId("{identifier}/{sub-id}={arg_1},{arg_2}")
   * setCustomId("moderation/viewcase=(userId:1234),(number:0)")
   */
  public parseId(customId?: string): IParseId {
    if (!customId) customId = this.interaction.customId;

    const identifier = customId.split("/"); // => name/sub=...(k:v);
    const args = customId.split("=").at(1); // => ...(k:v)
    const values = [];

    let id = identifier.at(0);
    const subId = identifier.at(1)?.split("=").at(0);
    if (!id) id = this.interaction.customId;

    if (args) {
      for (const arg of args.split(",")) {
        const argument = arg.replace("(", "").replace(")", "");
        const name = argument.split(":").at(0);
        const value = argument.split(":").at(1);
        if (name && value) values.push({ name, value });
      }
    }

    return {
      identifiers: {
        id,
        subId,
      },

      _parameters: values,
      parameters: new NeetButtonParameters(values),
    };
  }
}
