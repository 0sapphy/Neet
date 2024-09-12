const { formatEmoji } = require("discord.js");
const emojis = require("./emojis.json");

/**
 * @param {emojis} name
 * @returns
 */
function getEmoji(name) {
  const emoji = emojis.find((value) => value.name == name);
  if (!emoji) return ":star:";
  return formatEmoji(emoji.id, emoji.animated);
}

module.exports = {
  getEmoji,
};
