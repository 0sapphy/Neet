const { EmbedBuilder } = require("discord.js");
const { Subcommand } = require("@sapphire/plugin-subcommands");
const { getEmoji, getDate } = require("../lib/utils");

class WhoisCommand extends Subcommand {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "whois",
      subcommands: [
        {
          name: "user",
          chatInputRun: "whoisUser",
          cooldownDelay: 5_000,
        },
      ],
    });
  }

  /**
   * @param {Subcommand.Registry} registry
   */
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) => {
      return builder
        .setName("whois")
        .setDescription("Who is...")
        .addSubcommand((command) => {
          command
            .setName("user")
            .setDescription("View information on a specific user.")
            .addUserOption((option) => {
              return option
                .setName("user")
                .setDescription("Target user / or none")
                .setRequired(false);
            });

          this.addEphemeralOption(command);
          return command;
        });
    });
  }

  /**
   * @param {Subcommand.ChatInputCommandInteraction} interaction
   */
  async whoisUser(interaction) {
    const ephemeral = interaction.options.getBoolean("hide") || false;
    const user = interaction.options.getUser("user") || interaction.user;
    await interaction.deferReply({ ephemeral });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle(`${getEmoji("member")} User Information: ${user.username}`)
      .setDescription(
        `
- **Name**\n${getEmoji("right_arrow")} ${user.username}${user.globalName ? ` / ${user.globalName}` : ""}\n
- **Created At**\n${getEmoji("right_arrow")} ${getDate(user.createdAt)}
    `,
      )
      .setColor("Blurple")
      .setTimestamp();

    // Only display the embed footer if the user amd interaction user are not the same.
    if (user.id != interaction.user.id) {
      embed.setFooter({
        text: user.username,
        iconURL: user.displayAvatarURL(),
      });
    }

    interaction.editReply({
      embeds: [embed],
    });
  }

  addEphemeralOption(command) {
    return command.addBooleanOption((option) => {
      return option
        .setName("hide")
        .setDescription("Hide the bot response.")
        .setRequired(false);
    });
  }
}

module.exports = {
  WhoisCommand,
};
