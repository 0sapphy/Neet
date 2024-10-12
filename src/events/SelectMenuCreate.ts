import { Events } from "discord.js";
import { Neet, NeetButton, NeetEvent } from "../../lib";
import { writeError } from "../helpers/logger";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,
  run: async (interaction) => {
    const client = interaction.client as Neet;
    client.emit("cl-debug", "Recieved selectMenu interaction.");

    if (interaction.isChannelSelectMenu()) {
      const parsed = NeetButton.prototype.parseId(interaction.customId);

      try {
        client.emit("cl-debug", `Handing channelSelectMenu interaction.`);

        if (parsed.identifiers.subId) {
          (
            await import(
              `../application/selectMenu/channel/${parsed.identifiers.id}/${parsed.identifiers.subId}`
            )
          ).run(interaction, parsed.parameters);
        } else {
          (
            await import(
              `../application/selectMenu/channel/${parsed.identifiers.id}`
            )
          ).run(interaction, parsed.parameters);
        }
      } catch (error) {
        writeError("ChannelSelect", error);
      }
    }
  },
});
