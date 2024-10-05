import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "discord.js";
import { NeetCommandBuilder } from "../../../lib";
import { CommandMode, CommandRunType } from "../../../lib/Types/enum";

export function run(interaction: ChatInputCommandInteraction) {
  interaction.reply("Hi");
}

export default new NeetCommandBuilder({
  name: "ban",
  description: "Ban a user from this server",
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user to ban.",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "reason",
      description: "The reason to ban this user.",
      required: false,
    },
  ],
}).addHandlerOptions((options) => {
  return options
    .setMode(CommandMode.DEVELOPING_STAGE)
    .setUserPermissions(["BanMembers"])
    .setClientPermissions(["BanMembers"])
    .setRunType(CommandRunType.THIS);
});
