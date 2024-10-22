import { AttachmentBuilder, EmbedBuilder, Events } from "discord.js";
import { NeetEvent } from "../../lib";
import { CanvaBuilder, Templates } from "neet-canvas.js";
import { Setting } from "../models/Settings";

export default new NeetEvent<"guildMemberAdd">({
  name: Events.GuildMemberAdd,
  once: false,
  run: async (member) => {
    const { guild, user } = member;
    const data = await Setting.findOne({ guildId: guild.id });
    if (!data || data.welcome?.enabled != true || typeof data.welcome?.channelId != "string") return;

    const image = new CanvaBuilder({ template: Templates.WelcomeDefault }).set({
      username: user.username,
      members: guild.memberCount,
      avatarURL: user.displayAvatarURL(),
    });

    const ctx = await image.draw(image.canvas);

    const attachment = new AttachmentBuilder(ctx, {
      name: "welcome.jpeg",
      description: "Neet: Generated Welcome Image.",
    });

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username })
      .setThumbnail(guild.iconURL())
      .setDescription(`**${user.username}** joined **${guild.name}**.`)
      .setImage("attachment://welcome.jpeg")
      .setTimestamp()
      .setColor("Blurple");

    const channel = await guild.channels.fetch(data.welcome?.channelId);
    if (!channel || !channel.isSendable()) return;
    channel.send({ embeds: [embed], files: [attachment] });
  },
});
