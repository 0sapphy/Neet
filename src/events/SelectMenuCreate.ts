import { Events } from "discord.js";
import { Neet, NeetEvent, parseId } from "../../lib";
import { writeError } from "../helpers/logger";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,
  run: async (interaction) => {
    if (!interaction.isAnySelectMenu()) return;
    const client = interaction.client as Neet;
    client.emit("cl-debug", "Recieved selectMenu interaction.");

    if (interaction.isChannelSelectMenu()) {
      const parsed = parseId(interaction.customId);

      try {
        client.emit("cl-debug", `Handing channelSelectMenu interaction.`);

        (
          await import(
            `../application/selectMenu/channel/${parsed.id}/${parsed.sub_id}`
          )
        ).run(interaction, parsed.args);
      } catch (error) {
        writeError("ChannelSelect", error);
      }
    }
  },
});
