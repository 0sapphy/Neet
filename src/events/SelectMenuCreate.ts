import { Events } from "discord.js";
import { Neet, NeetEvent, parseId } from "../../lib";
import { writeError } from "../helpers/logger";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,
  run: async (interaction) => {
    if (interaction.isChannelSelectMenu()) {
      const client = interaction.client as Neet;
      const parsed = parseId(interaction.customId);

      try {
        client.emit("cl-debug", `[INTERACTION] >> ChannelSelectMenu (${parsed.id}).`);
        (await import(`../application/selectMenu/channel/${parsed.id}/${parsed.sub_id}`))
        .run(interaction, parsed.args);
      } catch (error) {
        writeError("ChannelSelect", error);
      }
    }
  },
});
