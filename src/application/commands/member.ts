import { ApplicationCommandOptionType } from "discord.js";
import { NeetCommandBuilder } from "../../../lib";
import { CommandMode, CommandRunType } from "../../../lib/Types/enum";

export default new NeetCommandBuilder({
    name: "member",
    description: "Member commands.",
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "whois",
            description: "Member information.",
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: "user",
                    description: "The user to get information on.",
                    required: true
                }
            ]
        }
    ]
}).addHandlerOptions((options) => {
    return options
    .setMode(CommandMode.DEVELOPING_STAGE)
    .setRunType(CommandRunType.HANDLE)
});