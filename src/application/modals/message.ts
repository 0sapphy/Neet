import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { Setting, UpdateQueryAnyGreeting } from "../../models/Settings";
import { Option } from "../../../lib";
import { emoji } from "../../helpers/utils";

export async function run(
  interaction: ModalSubmitInteraction<"cached">,
  args: object,
) {
  const { fields, user } = interaction;
  const module = Option.getString(args, "for");

  const content = fields.getTextInputValue("content");
  const authorName = nullIfEmptyString(fields.getTextInputValue("author_name"));
  const authorIcon = nullIfEmptyString(fields.getTextInputValue("author_icon"));
  const description = nullIfEmptyString(fields.getTextInputValue("description"));

  // Validate author options.
  if ((authorName && !authorIcon) || (authorIcon && !authorName)) {
    return interaction.reply({
      content: `**Author Fields** are not formatted correctly.`,
      ephemeral: true,
    });
  }

  await interaction.deferReply({ ephemeral: true });

  const data: UpdateQueryAnyGreeting = {
    options: {
      content: content,
      description: description,

      author: {
        name: authorName,
        iconURL: authorIcon,
      },
    },
  };

  await Setting[module === "welcome" ? "UpdateWelcome" : "UpdateFarewell"](
    interaction.guildId,
    data,
  );

  const embed = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
    .setTitle(`${emoji("Checkmark")} Saved Message Options: ${module}`)
    .setColor("Blurple")
    .setTimestamp();

  return await interaction.editReply({ embeds: [embed] });
}

function nullIfEmptyString(str: string) {
  return str.length === 0 ? null : str;
}
