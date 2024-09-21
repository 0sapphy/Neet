const { inspect } = require("node:util");
const moment = require("moment");
const style = require("colorette");

function getDate() {
  return moment().utcOffset(+5).format("DD/MM/YYYY hh:mm");
}

/**
 * @param {string} message
 * @param  {...any} args
 */
function writeInfo(message, ...args) {
  console.info(
    style.white(getDate()),
    style.bold(style.green("[INFO]")),
    style.blue(args.length > 0 ? `${message}\n` : message),

    args.length > 0
      ? inspect(args, {
          showHidden: false,
          depth: 5,
        })
      : "",
  );
}

/**
 * @param {string} message
 * @param  {...any} args
 */
function writeWarn(message, ...args) {
  console.warn(
    style.white(getDate()),
    style.bold(style.yellow("[WARN]")),
    style.magenta(args.length > 0 ? `${message}\n` : message),

    args.length > 0
      ? inspect(args, {
          showHidden: false,
          depth: 5,
        })
      : "",
  );
}

/**
 * @param {string} message
 * @param {Error|any} error
 */
function writeError(message, error) {
  console.error(
    style.white(getDate()),
    style.bold(style.red("[ERROR]")),
    style.black(message),

    inspect(error, {
      showHidden: true,
      depth: 5,
    }),
  );
}

module.exports = {
  writeInfo,
  writeWarn,
  writeError,
};
