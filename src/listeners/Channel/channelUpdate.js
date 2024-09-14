const { Listener, Events } = require("@sapphire/framework");
const Log = require("../../models/Log");
const { EmbedBuilder } = require("discord.js");
const { getEmoji } = require("../../lib/utils");

class ChannelUpdateEvent extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: Events.ChannelUpdate,
      enabled: true,
    });
  }

  /**
   * @param {import('discord.js').GuildChannel} old
   * @param {import('discord.js').GuildChannel} _new
   */
  async run(old, _new) {
    console.log(old.name, "->", _new.name);

    const { guild } = _new;
    const settings = await Log.findOne({ guildId: guild.id });
    if (typeof settings.channel.onUpdate != "string") return;
    const channel = guild.channels.cache.get(settings.channel.onUpdate);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setTitle(`${getEmoji("dash")} Channel Updated`)
      .setDescription(`- **Channel:**\n  - ${_new.id}\n  - ${_new}`)
      .setFooter({ text: `ID: ${_new.id} | #${_new.name}` })
      .setColor("Blurple")
      .setTimestamp();

    if (old.name != _new.name) {
      embed.addFields({
        name: `${getEmoji("line")} Name`,
        value: `>   ${getEmoji("right_arrow")} **${_new.name}**\n>   ${getEmoji("right_arrow")} ${old.name}`,
      });
    }

    return channel.send({
      embeds: [embed],
    });
  }
}

module.exports = {
  ChannelUpdateEvent,
};
