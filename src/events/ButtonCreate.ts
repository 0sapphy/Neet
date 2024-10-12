import { Events } from "discord.js";
import { NeetEvent, Neet } from "../../lib";
import { NeetButton } from "../../lib/Client/NeetButton/NeetButton";
import { writeError } from "../helpers/logger";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,
  run: async (interaction) => {
    if (!interaction.isButton()) return;
    const client = interaction.client as Neet;
    client.emit("cl-debug", `Received a button interaction.`);

    const button = new NeetButton(interaction);
    const parsed = button.parseId();

    client.emit(
      "cl-debug",
      `Received button interaction: ${parsed.identifiers.id}/${parsed.identifiers.subId}`,
    );

    try {
      client.emit("cl-debug", `Handing button interaction.`);

      if (parsed.identifiers.subId) {
        (
          await import(
            `../application/buttons/${parsed.identifiers.id}/${parsed.identifiers.subId}`
          )
        ).run(interaction, parsed.parameters);
      } else {
        (await import(`../application/buttons/${parsed.identifiers.id}`)).run(
          interaction,
          parsed.parameters,
        );
      }
    } catch (error) {
      writeError("ButtonCreate", error);
    }
  },
});
