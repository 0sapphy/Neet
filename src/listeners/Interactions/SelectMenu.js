const { Listener, Events } = require("@sapphire/framework");
const Log = require("../../models/Log");
const { EmbedBuilder } = require("discord.js");
const { getEmoji } = require("../../lib/utils");

class ChannelSelectMenuInteraction extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: Events.InteractionCreate,
      enabled: true,
    });
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async run(interaction) {
    if (interaction.isChannelSelectMenu()) {
      const { customId, values, user } = interaction;

      if (customId.split("-")[0] === "logchannel") {
        await interaction.deferUpdate({ ephemeral: true });
        const type = customId.split("-")[1];
        const targetCID = values[0];

        const embed = new EmbedBuilder()
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
          .setDescription(`${getEmoji("checkmark")} **Updated Settings**\n`)
          .setColor("Blurple")
          .setTimestamp();

        if (type === "_all") {
          const update = {
            channel: {
              onCreate: targetCID,
              onUpdate: targetCID,
              onDelete: targetCID,
            },
          };

          for (const V of ["onCreate", "onUpdate", "onDelete"]) {
            embed.data.description += `   ${getEmoji("right_arrow")} ${V}\n`;
          }

          await Log.findOneAndUpdate({ guildId: interaction.guildId }, update, {
            upsert: true,
          });
        } else {
          const update = {
            channel: {
              [type]: targetCID,
            },
          };

          embed.data.description += `   ${getEmoji("right_arrow")} ${type}`;

          await Log.findOneAndUpdate({ guildId: interaction.guildId }, update, {
            upsert: true,
          });
        }

        return interaction.editReply({
          embeds: [embed],
          components: [],
        });
      }
    } else if (interaction.isStringSelectMenu()) {
      const { customId, values, guild, user } = interaction;
      const value = values.at(0);

      if (customId === "logchannel-disable") {
        await interaction.deferUpdate();

        const embed = new EmbedBuilder()
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
          .setDescription(`${getEmoji("checkmark")} **Updated Settings**\n`)
          .setColor("Blurple")
          .setTimestamp();

        if (value === "All") {
          const update = {};

          for (const V of ["onCreate", "onUpdate", "onDelete"]) {
            Object.assign(update, { [V]: null });
            embed.data.description += `  ${getEmoji("right_arrow")} ${V}: ${getEmoji("off")}\n`;
          }

          await Log.findOneAndUpdate({ guildId: guild.id }, update, {
            upsert: true,
          });
        } else {
          embed.data.description += `  ${getEmoji("right_arrow")} ${value}: ${value}: ${getEmoji("off")}`;

          await Log.findOneAndUpdate(
            { guildId: guild.id },
            { [value]: null },
            { upsert: true },
          );
        }

        return interaction.editReply({ embeds: [embed], components: [] });
      }
    }
  }
}

module.exports = {
  ChannelSelectMenuInteraction,
};
