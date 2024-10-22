/**
 * SHOW A MODAL FOR UPDATING MESSAGE COMPONENTS ("settings.(welcome,farewell)")
 */

import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Arguments, componentGetString, customId } from "../../../../lib";
import { isCommandUser } from "../../../helpers/utils";
import { Setting } from "../../../models/Settings";

export async function run(interaction: ButtonInteraction, args: Arguments[]) {
  if (!isCommandUser(interaction)) return;

  const module = componentGetString(args, "for");
  if (!module) return; // WNE*

  const data = await Setting.findOne({ guildId: interaction.guildId });
  if (!data) return; // WNE*
  const values = data[module === "welcome" ? "welcome" : "farewell"]?.options;

  const AuthorNameField = new TextInputBuilder()
    .setCustomId("author_name")
    .setLabel("Embec Author Name Field")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);
  if (values?.author?.name) AuthorNameField.setValue(values.author.name);

  const AuthorIconField = new TextInputBuilder()
    .setCustomId("author_icon")
    .setLabel("Embded Author Icon Field")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);
  if (values?.author?.iconURL) AuthorIconField.setValue(values.author.iconURL);

  const DescriptionField = new TextInputBuilder()
    .setCustomId("description")
    .setLabel("Embed Description Field")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);
  if (values?.description) DescriptionField.setValue(values.description);

  const MessageModal = new ModalBuilder()
    .setCustomId(
      customId("message", "E", [
        { name: "use>id", value: true },
        { name: "for", value: module },
      ]),
    )
    .setTitle(`Message Settings: ${module}`)
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().setComponents(
        new TextInputBuilder()
          .setCustomId("content")
          .setLabel("Content")
          .setStyle(TextInputStyle.Paragraph)
          .setValue(values?.content ? values.content : "**Welcome!** {mention}")
          .setRequired(true),
      ),

      new ActionRowBuilder<TextInputBuilder>().setComponents(AuthorNameField),
      new ActionRowBuilder<TextInputBuilder>().setComponents(AuthorIconField),
      new ActionRowBuilder<TextInputBuilder>().setComponents(DescriptionField),
    );

  await interaction.showModal(MessageModal);
}
