import { Events, Client } from "discord.js";
import { Bot } from "lib:logger";

export default {
    name: Events.ClientReady,
    once: true,
    run: (client: Client) => {
        Bot.success(`${client.user?.username} is ALIVE and READY.`);
    }
}