import { Events } from "discord.js";
import { componentGetBoolean, Neet, NeetEvent, parseId } from "../../lib";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,
  run: async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    const client = interaction.client as Neet;
    client.emit("cl-debug", "Recieved modal interaction.");
    const parsed = parseId(interaction.customId);

    if (componentGetBoolean(parsed.args, "use>id") === true) {
      (await import(`../application/modals/${parsed.id}`)).run(
        interaction,
        parsed.args,
      );
      return;
    }

    (await import(`../application/modals/${parsed.id}/`)).run(
      interaction,
      parsed.args,
    );
    return;
  },
});
