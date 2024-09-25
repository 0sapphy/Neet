const emojis = require("../../scripts/dev/emojis.json");
const { formatEmoji } = require("discord.js");

/**
 * @param {keyof emojis} name
 */
function emoji(name, raw = false) {
  const emoji = emojis[name];
  return raw ? emoji : formatEmoji(emoji, emoji.animated);
}

module.exports = {
  emoji,
};
