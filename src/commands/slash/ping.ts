import { MessageFlags, SlashCommandBuilder, TextDisplayBuilder } from "discord.js";
import { SlashCommandStructure } from "../../../lib/DiscordJS/types.client";

export default {
    data: new SlashCommandBuilder().setName("ping").setDescription("Ping, Pong!"),
    async run(interaction, context) {
        const clientPing = context.client.ws.ping / 1000;
        const textDisplay = new TextDisplayBuilder().setContent(`**Ping:** \`${clientPing}\`ms`);

        interaction.reply({
            components: [textDisplay],
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2]
        });
    },
} satisfies SlashCommandStructure