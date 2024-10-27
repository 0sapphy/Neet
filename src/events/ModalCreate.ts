import { Events } from "discord.js";
import { componentGetBoolean, Neet, NeetEvent, parseId } from "../../lib";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,
  run: async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    const client = interaction.client as Neet;
    const parsed = parseId(interaction.customId);

    client.emit("cl-debug", `[INTERACTION] >> ModalSubmit (${parsed.id}).`)

    if (componentGetBoolean(parsed.args, "use>id") === true) {
      (await import(`../application/modals/${parsed.id}`))
        .run(interaction, parsed.args);
    }
    
    (await import(`../application/modals/${parsed.id}/${parsed.sub_id}`))
      .run(interaction, parsed.args);
  },
});
