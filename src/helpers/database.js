const Users = require("../models/Users");

/**
 * @param {import("../models/Guilds")} model
 * @param {import('../../scripts/dev/database').Guild} data
 */
async function createOgetData(model, _data) {
  let data;
  let error = false;

  data = await model.findOne(_data).catch((error = true));
  if (!data) data = await model.create(_data).catch((error = true));

  return {
    data,
    error,
  };
}

/**
 * @param {string} userId
 * @param {{ moderator_id: string, user_id: string, guild_id: string, reason: string, action: 'ban' | 'kick' | 'warn' }} [data]
 * @param {{ upsert: boolean; new: boolean; }} [options={ upsert: false, new: true }]
 */
async function createCase(userId, data, options = { upsert: true, new: true }) {
  Object.assign(data, { user_id: userId });

  return await Users.findOneAndUpdate(
    { userId },
    { $push: { cases: data } },
    options,
  );
}

module.exports = {
  createOgetData,

  Cases: {
    createCase,
  },
};
