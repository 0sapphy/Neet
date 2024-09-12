const { Listener, Events } = require("@sapphire/framework");
const Log = require("../../models/Log");
const { EmbedBuilder } = require("discord.js");
const { getEmoji } = require("../../lib/utils");

class ChannelDeleteEvent extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: Events.ChannelDelete,
      enabled: true,
    });
  }

  /**
   * @param {import('discord.js').GuildChannel} channel
   */
  async run(channel) {
    const { guild } = channel;
    const settings = await Log.findOne({ guildId: guild.id });
    if (typeof settings.channel.onDelete != "string") return;
    const LChannel = guild.channels.cache.get(settings.channel.onDelete);
    if (!LChannel) return;

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setTitle(`${getEmoji("minus")} Channel Deleted`)
      .addFields(
        { name: "Name", value: `${getEmoji("right_arrow")} ${channel.name}` },
        { name: "ID", value: `${getEmoji("right_arrow")} ${channel.id}` },
      )
      .setColor("Red")
      .setTimestamp();

    return LChannel.send({ embeds: [embed] });
  }
}

module.exports = {
  ChannelDeleteEvent,
};
