import { Events } from "discord.js";
import { Parse, Option, Neet, NeetEvent, CompileArguments } from "../../lib";
import signale from "signale";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,
  run: async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    const client = interaction.client as Neet;
    const parsed = Parse(interaction.customId);
    const args = CompileArguments(parsed)

    client.emit("cl-debug", `[INTERACTION] >> ModalSubmit (${parsed.I}).`)

    try {
      if (Option.getBoolean(parsed, "use>id") === true) {
        (await import(`../application/modals/${parsed.I}`))
        .run(interaction, args);
      }
      
      (await import(`../application/modals/${parsed.I}${parsed.S ? `/${parsed.S}` : ""}`))
      .run(interaction, args);
    } catch (error) {
      signale.error("ModalCreate error", error);
    }
  },
});
