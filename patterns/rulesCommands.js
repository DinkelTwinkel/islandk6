const { EmbedBuilder } = require('discord.js');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const rulesButtons = require('./rulesButtons');

module.exports = async (client, interaction, customID) => {

  const embed = new EmbedBuilder()
  .setTitle("🤖 TEXT COMMANDS")
  .setDescription("To use slash commands, simply type them in chat like \"/kimo\".\n```\n/kimo [shows current kimo status]\n/id [lets you see your info or other user's info]\n/setid [lets you customize your info card]\n/rules [show rules]\n/figure [what is a figure guideline]\n/give [give seashells to another user]\n/fish [find something in a bottle. costs 1 shell]\n/bottle [write something in a bottle. costs 10 shells]\n/host [gain the power to create events. costs 500 shells]\n/therapy [stop, get some help]\n/nickname [change your name at the cost of 10 sea shell]\n```\nIs something wrong? Use/report to tell an admin quietly.");

    // if (interaction.isButton()) {
    //     interaction.deferUpdate();
    //     return interaction.message.edit({ content: '', embeds: [embed] , ephemeral: true, components: [await rulesButtons(customID)] });
    // }

    interaction.reply({ content: '', embeds: [embed] , ephemeral: true, components: [await rulesButtons(customID)] });

};
