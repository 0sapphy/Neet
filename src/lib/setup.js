require("@sapphire/plugin-logger/register");
require("@sapphire/plugin-api/register");
require("@sapphire/plugin-editable-commands/register");
require("@sapphire/plugin-subcommands/register");
const {
  ApplicationCommandRegistries,
  RegisterBehavior,
} = require("@sapphire/framework");
const { createColors } = require("colorette");
const { inspect } = require("node:util");

// Set default behavior to bulk overwrite
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
  RegisterBehavior.BulkOverwrite,
);

// Set default inspection depth
inspect.defaultOptions.depth = 1;

createColors({ useColor: true });
