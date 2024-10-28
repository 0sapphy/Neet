import { Events } from "discord.js";
import { CompileArguments, Neet, NeetEvent, Parse } from "../../lib";
import signale from "signale";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,
  run: async (interaction) => {
    if (interaction.isChannelSelectMenu()) {
      const client = interaction.client as Neet;
      const parsed = Parse(interaction.customId);
      const args = CompileArguments(parsed);
      
      client.emit("cl-debug", `[INTERACTION] >> ChannelSelectMenu (${parsed.I}).`);

      try {
        (await import(`../application/selectMenu/channel/${parsed.I}${parsed.S ? `/${parsed.S}` : ""}`))
        .run(interaction, args);
      } catch (error) {
        signale.error("ChannelSelect error", error);
      }
    }
  },
});
