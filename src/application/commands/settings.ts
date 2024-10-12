import { ApplicationCommandOptionType } from "discord.js";
import { NeetCommandBuilder } from "../../../lib";
import { CommandMode, CommandRunType } from "../../../lib/Types/enum";

export default new NeetCommandBuilder({
  name: "settings",
  description: "Configure the bot settings.",
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "welcome",
      description: "Configure the welcome settings.",
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "farewell",
      description: "Configure the farewell settings.",
    },
  ],
}).addHandlerOptions((options) => {
    return options
    .setMode(CommandMode.DEVELOPING_STAGE)
    .setRunType(CommandRunType.HANDLE)
    .setUserPermissions(["ManageGuild"])
})
