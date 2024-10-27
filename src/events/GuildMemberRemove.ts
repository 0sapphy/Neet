import { AttachmentBuilder, EmbedBuilder, Events } from "discord.js";
import { NeetEvent } from "../../lib";
import { Setting } from "../models/Settings";
import { CanvaBuilder, Templates } from "neet-canvas.js";

export default new NeetEvent<"guildMemberRemove">({
  name: Events.GuildMemberRemove,
  once: false,
  run: async (member) => {
    const { guild, user } = member;
    const data = await Setting.findOne({ guildId: guild.id });
    if (!data || data.farewell?.enabled != true || typeof data.farewell.channelId != "string") return;

    const image = new CanvaBuilder({ template: Templates.FarewellDefault }).set(
      {
        username: user.username,
        members: guild.memberCount,
        avatarURL: user.displayAvatarURL(),
      },
    );

    const buffer = await image.draw(image.canvas);

    const attachment = new AttachmentBuilder(buffer, {
      name: "farewell.jpeg",
      description: "Neet: Farewell Image",
    });

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username })
      .setThumbnail(guild.iconURL())
      .setImage("attachment://farewell.jpeg")
      .setDescription(`**${user.username}** left **${guild.name}**`)
      .setColor("Orange")
      .setTimestamp();

    const channel = guild.channels.cache.get(data.farewell.channelId);
    if (!channel?.isSendable()) return;
    channel.send({ embeds: [embed], files: [attachment] });
  },
});
