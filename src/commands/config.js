const { Subcommand } = require("@sapphire/plugin-subcommands");
const {
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const { getEmoji, switchify } = require("../lib/utils");
const Log = require("../models/Log");

class ConfigCommand extends Subcommand {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "config",
      subcommands: [
        {
          type: "group",
          name: "log",
          entries: [
            { name: "channels", chatInputRun: "logChannels" },
            { name: "messages", chatInputRun: "logMessages" },
          ],
        },
      ],
    });
  }

  /**
   * @param {Subcommand.Registry} builder
   */
  registerApplicationCommands(builder) {
    builder.registerChatInputCommand((builder) => {
      return builder
        .setName("config")
        .setDescription("Configure guild settings.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommandGroup((group) => {
          return group
            .setName("log")
            .setDescription("Configure the log settings...")
            .addSubcommand((command) => {
              return command
                .setName("messages")
                .setDescription("Log message update/delete events.")
                .addStringOption((option) => {
                  return option
                    .setName("type")
                    .setDescription("The type of message event to configure.")
                    .setRequired(true)
                    .setChoices(
                      { name: "Update", value: "onUpdate" },
                      { name: "Delete", value: "onDelete" },
                      { name: "All", value: "_all" },
                    );
                });
            })

            .addSubcommand((command) => {
              return command
                .setName("channels")
                .setDescription("Log channel create/update/delete events.")
                .addStringOption((option) => {
                  return option
                    .setName("type")
                    .setDescription("The type of channel event to configure.")
                    .setRequired(true)
                    .setChoices(
                      { name: "Create", value: "onCreate" },
                      { name: "Update", value: "onUpdate" },
                      { name: "Delete", value: "onDelete" },
                      { name: "All", value: "_all" },
                    );
                });
            });
        });
    });
  }

  /**
   * @param {Subcommand.ChatInputCommandInteraction} interaction
   */
  async logChannels(interaction) {
    const { user, guild } = interaction;

    await interaction.deferReply();
    const type = interaction.options.getString("type");
    const settings = await Log.findOne({ guildId: guild.id });

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setDescription(
        `-# Configure the log channels, select a channel below using the select menu.\n\n${getEmoji("checkmark")} **Update Settings**\n`,
      )
      .setColor("Random")
      .setTimestamp();

    if (type === "_all") {
      for (const V of ["onCreate", "onUpdate", "onDelete"]) {
        embed.data.description += `   ${getEmoji("right_arrow")} ${V}: ${switchify(settings.channel[V])}\n`;
      }
    } else {
      embed.data.description += `   ${getEmoji("right_arrow")} ${type}: ${switchify(settings.channel[type])}\n`;
    }

    const channelSelect = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId(`logchannel-${type}`)
        .setChannelTypes([ChannelType.GuildText])
        .setPlaceholder("Select a channel"),
    );

    const stringSelect = new StringSelectMenuBuilder()
      .setCustomId("logchannel-disable")
      .setPlaceholder("Select something to disable");

    ["onCreate", "onUpdate", "onDelete", "All"].map((V) => {
      this.container.logger.info(V);
      stringSelect.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(V)
          .setDescription(`Disable ${V != "All" ? V : "everything"}`)
          .setEmoji({ id: getEmoji("off", true) })
          .setValue(V),
      );
    });

    const stringSelectRow = new ActionRowBuilder().addComponents(stringSelect);

    return interaction.editReply({
      embeds: [embed],
      components: [channelSelect, stringSelectRow],
    });
  }
}

module.exports = {
  ConfigCommand,
};
