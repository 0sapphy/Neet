const Users = require("../models/Users");

/**
 * @returns {string}
 */
function uniqueID() {
  return crypto.randomUUID();
}

/**
 * @param {import("../models/Guilds")} model
 * @param {import('../../scripts/dev/database').Guild} _data
 */
async function createOgetData(model, _data) {
  let data;
  let error = false;

  data = await model.findOne(_data).catch((e) => {
    console.error(e);
    error = true;
  });

  if (!data)
    data = await model.create(_data).catch((e) => {
      console.error(e);
      error = true;
    });

  return {
    data,
    error,
  };
}

/**
 * @param {string} userId
 * @param {{ case_id: string, moderator_id: string, user_id: string, guild_id: string, reason: string, action: 'ban' | 'kick' | 'warn' }} [data]
 * @param {{ upsert: boolean; new: boolean; }} [options={ upsert: false, new: true }]
 */
async function createCase(userId, data, options = { upsert: true, new: true }) {
  // Assign values to data.
  Object.assign(data, { user_id: userId, case_id: uniqueID() });

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
