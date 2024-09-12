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
          .setDescription(`${getEmoji("check")} **Updated Settings**\n`)
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
    }
  }
}

module.exports = {
  ChannelSelectMenuInteraction,
};
