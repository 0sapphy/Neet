const { formatEmoji } = require("discord.js");
const moment = require("moment");
const emojis = require("./emojis.json");

/**
 * @param {keyof emojis} name
 * @param {boolean} [rid=false]
 * @returns {string}
 */
function getEmoji(name, rid = false) {
  const emoji = emojis[name];
  if (!emoji) return "🍀";
  if (rid) return emoji.id;

  return formatEmoji(emoji.id, emoji.animated);
}

/**
 * @param {string|boolean} V
 */
function switchify(V) {
  if (typeof V === "boolean") {
    return V ? getEmoji("on") : getEmoji("off");
  } else if (typeof V === "string") {
    return V ? getEmoji("on") : "off";
  }
}

/**
 * @returns {string}
 */
function getDate(date) {
  return moment(date).format("YYYY/MM/DD");
}

module.exports = {
  switchify,

  getEmoji,
  getDate,
};
