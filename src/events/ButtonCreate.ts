import { Events } from "discord.js";
import { NeetEvent, Neet, CompileArguments } from "../../lib";
import { Parse } from "../../lib";
import signale from "signale";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,
  run: async (interaction) => {
    if (!interaction.isButton()) return;
    const client = interaction.client as Neet;
    const parsed = Parse(interaction.customId);
    const args = CompileArguments(parsed)

    client.emit("cl-debug", `[INTERACTION] Button >> (${parsed.I}/${parsed.S}).`);

    try {
      (await import(`../application/buttons/${parsed.I}${parsed.S ? `/${parsed.S}` : ""}`))
      .run(interaction, args);
    } catch (error) {
      signale.error("ButtonCreate error", error);
    }
  },
});
