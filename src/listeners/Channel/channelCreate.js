const { Listener, Events } = require("@sapphire/framework");
const Log = require("../../models/Log");
const { EmbedBuilder } = require("discord.js");
const { getEmoji } = require("../../lib/utils");

class ChannelCreateEvent extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: Events.ChannelCreate,
      enabled: true,
    });
  }

  /**
   * @param {import('discord.js').GuildChannel} channel
   */
  async run(channel) {
    const { guild } = channel;

    const settings = await Log.findOne({ guildId: guild.id });
    if (typeof settings.channel.onCreate != "string") return;
    const LChannel = guild.channels.cache.get(settings.channel.onCreate);
    if (!LChannel) return;

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setTitle(`${getEmoji("plus")} Channel Created`)
      .addFields(
        {
          name: `Name`,
          value: `${getEmoji("right_arrow")} ${channel.name}`,
          inline: true,
        },
        {
          name: `ID`,
          value: `${getEmoji("right_arrow")} ${channel.id}`,
          inline: true,
        },
      )
      .setColor("Orange")
      .setTimestamp();

    return LChannel.send({ embeds: [embed] });
  }
}

module.exports = {
  ChannelCreateEvent,
};
