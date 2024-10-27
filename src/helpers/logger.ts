import { inspect } from "node:util";
import moment from "moment";
import style from "chalk";

function getDate() {
  return moment().utcOffset(+5).format("DD/MM/YYYY hh:mm");
}

export function writeDebug(message: string, ...args: unknown[]) {
  console.debug(
    style.white(getDate()),
    style.bold(style.black("[DEBUG]")),
    style.yellow(message),

    args.length > 0 ? inspect(args) : "",
  );
}

export function writeInfo(message: string, ...args: unknown[]) {
  console.info(
    style.white(getDate()),
    style.bold(style.green("[INFO]")),
    style.blue(args.length > 0 ? `${message}\n` : message),

    args.length > 0 ? inspect(args) : "",
  );
}

export function writeWarn(message: string, ...args: unknown[]) {
  console.warn(
    style.white(getDate()),
    style.bold(style.yellow("[WARN]")),
    style.magenta(args.length > 0 ? `${message}\n` : message),

    args.length > 0 ? inspect(args) : "",
  );
}

export function writeError(message: string, error: Error | unknown) {
  console.error(
    style.white(getDate()),
    style.bold(style.red("[ERROR]")),
    style.black(message),

    inspect(error),
  );
}
