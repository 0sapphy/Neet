import { Events } from "discord.js";
import { Neet, NeetEvent } from "../../lib";

export default new NeetEvent<"interactionCreate">({
  name: Events.InteractionCreate,
  once: false,

  run: (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const client = interaction.client as Neet;
    const { guild } = interaction;

    const context = client.commands.get(interaction.commandName);
    if (!context) return;

    //context.run(interaction);
  },
});
