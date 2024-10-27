process.loadEnvFile(".env");

import Prompts from "prompts";
import signale from "signale";
import axios from "axios";
import { writeFileSync } from "node:fs"

const questions: Prompts.PromptObject<string> = {
    type: "confirm",
    name: "confirm-sync",
    message: "Are you sure you want to SYNC emojis?"
};

(async() => {
    Prompts(questions, {
        onCancel() {
            signale.star({ prefix: `[SCRIPTS]`, message: `Okay, stopped prompt.` });
        },

        async onSubmit(prompt, A) {
            if (A != true) {
                signale.star({ prefix: `[SCRIPTS]`, message: `Cancelled emoji SYNC.` });
                return false;
            }

            const data = await fetch();
            writeFile(data);
        }
    });
})();

function writeFile(data: unknown[]) {
    signale.complete({ prefix: "[SYNC]", message: `Writing formatted data to icons.json` });

    return writeFileSync("./icons.json", JSON.stringify(data, undefined, 5));
}

async function fetch() {
    signale.start({ prefix: "[SYNC]", message: `Fetching emojis from https://discord.com/api` });
    const data = await axios(`https://discord.com/api/applications/${process.env.CLIENT_ID}/emojis`, {
        method: "GET",
        headers: {
            Authorization: `Bot ${process.env.TOKEN}`
        }
    });

    signale.warn({ prefix: "[SYNC]", message: `Fetched ${data.data.items.length} emojis. Formatting data...` });

    const formatted = FormatData(data.data);
    return formatted;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FormatData(data: any) {
    const AllEmojisFormatted = [];
    for (const E of data.items) {
        AllEmojisFormatted.push({
            id: E.id,
            name: E.name,
            animated: E.animated
        });
    };

    return AllEmojisFormatted;
}