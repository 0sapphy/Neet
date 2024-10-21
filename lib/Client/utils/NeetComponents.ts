/**
 * Utility methods for components (buttons, modals & selectMenu)
 */

import { RestOrArray, normalizeArray } from "discord.js";

/**
 * ### Parse the customId passed to AnyComponentBuilder
 *
 * customId should be formatted in a special way (for any component)
 * @example
 * <AnyComponentBuilder>.setCustomId("id/sub-id=(username:xyz)")
 */
export function parseId(id: string): ParsedResult {
  const identifiers = id.split("/");
  const main = identifiers[0];
  const sub = identifiers[1].split("=")[0];
  const args = id.split("=")[1];
  const params = [];

  if (args != undefined) {
    for (const arg of args.split("»")) {
      const argument = arg.replace("(", "").replace(")", "");
      const name = argument.split(":").at(0);
      const value = argument.split(":").at(1);
      if (name && value) params.push({ name, value });
    }
  }

  return {
    id: main,
    sub_id: sub,
    args: params,
  };
}

/**
 * ### Create a customId that can be used in ANY component with this function
 * **NOTE:** A customId cannot contain more than 100 chars
 * will throw an error if it does.
 *
 * @example
 * // Without arguments.
 * customId("main", "sub");
 *
 * // With arguments.
 * customId("main", "sub", [{ name: "username", value: "0sapphy" }]);
 */
export function customId(
  main: string,
  sub: string,
  args?: RestOrArray<Arguments>,
) {
  if (args != undefined) {
    let id = `${main}/${sub}=`;
    let i = 0;
    for (const arg of normalizeArray<Arguments>(args)) {
      i++;
      id += `(${arg.name}:${arg.value})${i > 0 && i != args.length ? "»" : ""}`;
    }

    if (id.length > 100)
      throw Error("An customId cannot contain MORE than 100 chars.");
    return id;
  }

  return `${main}/${sub}`;
}

export function componentGetOption(
  result: Arguments[],
  name: string,
  required?: boolean,
) {
  if (required === undefined) required = false;
  const arg = result.find((i) => i.name === name);
  if (!arg?.value) {
    if (required)
      throw Error("Required componentGetString(): but got no value.");
    return null;
  }

  return arg;
}

export function componentGetString(
  result: Arguments[],
  name: string,
  required?: boolean,
) {
  const res = componentGetOption(result, name, required);
  return res?.value.toString();
}

export function componentGetBoolean(
  result: Arguments[],
  name: string,
  required?: boolean,
) {
  const res = componentGetOption(result, name, required);
  return Boolean(res?.value);
}

export interface Arguments {
  name: string;
  value: string | boolean | number;
}

interface ParsedResult {
  id: string;
  sub_id: string;
  args: Arguments[] | never[];
}
