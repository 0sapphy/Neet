import { Client, Collection, ClientOptions } from "discord.js";
import { INeetCommand } from "../Types/neet";

export class Neet<T extends boolean = false> extends Client<T> {
  public constructor(options: ClientOptions) {
    super(options);
  }

  public commands = new Collection<string, INeetCommand>();
}
