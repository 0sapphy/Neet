import { ClientEvents } from "discord.js";
import { INeetEvent } from "../Types/neet";

export class NeetEvent<N extends keyof ClientEvents> {
  public options: INeetEvent<N>;
  public constructor(event: INeetEvent<N>) {
    this.options = event;
  }
}
