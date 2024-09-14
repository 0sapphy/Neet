const { Listener } = require("@sapphire/framework");
const {
  blue,
  gray,
  green,
  magenta,
  magentaBright,
  white,
  yellow,
} = require("colorette");
const { writeFile } = require("node:fs/promises");
const { version } = require("../../package.json");

const dev = process.env.NODE_ENV !== "production";
const style = dev ? yellow : blue;

class UserEvent extends Listener {
  constructor(context, options = {}) {
    super(context, {
      ...options,
      once: true,
    });
  }

  async run() {
    this.printBanner();
    this.printStoreDebugInformation();
  }

  /**
   * @param {import('discord.js').Collection<string, import('discord.js').ApplicationEmoji>} data
   */
  saveEmojis(data) {
    writeFile("./src/lib/emojis.json", JSON.stringify(data.toJSON(), null, 2))
      .then(() => {
        this.container.logger.info("Saved application emojis to emojis.json");
      })
      .catch((reason) => this.container.logger.error(reason));
  }

  printBanner() {
    const success = green("+");
    const llc = dev ? magentaBright : white;
    const blc = dev ? magenta : blue;
    const line01 = llc("");
    const line02 = llc("");
    const line03 = llc("");
    const pad = " ".repeat(7);

    console.log(
      String.raw`
            ${line01} ${pad}${blc(version)}
            ${line02} ${pad}[${success}] Gateway
            ${line03}${dev ? ` ${pad}${blc("<")}${llc("/")}${blc(">")} ${llc("DEVELOPMENT MODE")}` : ""}
            `.trim(),
    );
  }

  printStoreDebugInformation() {
    const { client, logger } = this.container;
    const stores = [...client.stores.values()];
    const last = stores.pop();
    for (const store of stores) logger.info(this.styleStore(store, false));
    logger.info(this.styleStore(last, true));
  }

  styleStore(store, last) {
    return gray(
      `${last ? "└─" : "├─"} Loaded ${style(store.size.toString().padEnd(3, " "))} ${store.name}.`,
    );
  }
}

module.exports = {
  UserEvent,
};
