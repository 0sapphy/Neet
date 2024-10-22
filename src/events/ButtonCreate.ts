import { Events } from "discord.js";
import { NeetEvent, Neet } from "../../lib";
import { parseId } from "../../lib";
import { writeError } from "../helpers/logger";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,
  run: async (interaction) => {
    if (!interaction.isButton()) return;
    const client = interaction.client as Neet;
    const parsed = parseId(interaction.customId)

    client.emit("cl-debug", `[INTERACTION] Button >> (${parsed.id}/${parsed.sub_id}).`);

    try {
      (await import(`../application/buttons/${parsed.id}/${parsed.sub_id}`))
      .run(interaction, parsed.args);
    } catch (error) {
      writeError("ButtonCreate", error);
    }
  },
});
