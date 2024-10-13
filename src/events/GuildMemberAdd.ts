import { AttachmentBuilder, EmbedBuilder, Events } from "discord.js";
import { NeetEvent } from "../../lib";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import Settings from "../models/Settings";

export default new NeetEvent<"guildMemberAdd">({
  name: Events.GuildMemberAdd,
  once: false,
  run: async (member) => {
    const { guild, user } = member;
    const data = await Settings.findOne({ guildId: guild.id });
    if (
      !data ||
      data.welcome?.enabled != true ||
      typeof data.welcome?.channelId != "string"
    )
      return;

    const canvas = createCanvas(1772, 633);
    const ctx = canvas.getContext("2d");
    const background = await loadImage("./assets/welcome.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#295F98";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    if (user.username.length > 13) {
      ctx.font = "bold 100px Genta";
      ctx.fillStyle = member.displayHexColor
        ? member.displayHexColor
        : "#08C2FF";
      ctx.fillText(user.username, 720, canvas.height / 2 + 5);
    } else {
      ctx.font = "bold 110px Genta";
      ctx.fillStyle = member.displayHexColor
        ? member.displayHexColor
        : "#08C2FF";
      ctx.fillText(user.username, 720, canvas.height / 2 + 5);
    }

    ctx.font = "bold 70px Genta";
    ctx.fillStyle = "#FF6868";
    ctx.fillText("#", canvas.width - 255, canvas.height / 2 + 5);

    ctx.font = "bold 70px Genta";
    ctx.fillStyle = "#9EA1D4";
    ctx.fillText(
      `${guild.memberCount}`,
      canvas.width - 200,
      canvas.height / 2 + 5,
    );

    ctx.font = "bold 60px Genta";
    ctx.fillStyle = "#AAD7D9";
    ctx.fillText(guild.name, 700, canvas.height / 2 - 150);

    ctx.beginPath();
    ctx.fillStyle = "#295F98";
    ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatarImage = await loadImage(
      user.displayAvatarURL({ extension: "png" }),
    );
    ctx.drawImage(avatarImage, 65, canvas.height / 2 - 250, 500, 500);

    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: "welcome.png",
      description: "Neet: Generated Welcome Image.",
    });

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username })
      .setThumbnail(guild.iconURL())
      .setDescription(`**${user.username}** joined **${guild.name}**.`)
      .setImage("attachment://welcome.png")
      .setTimestamp()
      .setColor("Blurple");

    const channel = await guild.channels.fetch(data.welcome?.channelId);
    if (!channel || !channel.isSendable()) return;
    channel.send({ embeds: [embed], files: [attachment] });
  },
});
