const { EmbedBuilder } = require('discord.js');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const rulesButtons = require('./rulesButtons');

module.exports = async (client, interaction, customID) => {

  const embed = new EmbedBuilder()
  .setTitle("KIMO 6 TEAM ♦")
  .addFields(
    {
      name: "JASON",
      value: "https://www.instagram.com/_zantide/\n(leadership, code-rat, design, art)",
      inline: false
    },
    {
      name: "AMREIO",
      value: "https://www.instagram.com/amreio/\n(kimo founder, secretary, cottage aunt)",
      inline: false
    },
    {
      name: "ANDREW",
      value: "https://www.instagram.com/andrewghung/\n(moderation, quest NPC, Florida man)",
      inline: false
    },
    {
      name: "EVYN",
      value: "https://www.instagram.com/evynfong/\n(moderation, art, quest NPC, legendary pokemon)",
      inline: false
    },
    {
      name: "SOL",
      value: "https://www.instagram.com/solaski/\n(moderation, hosting, quest NPC)",
      inline: false
    },
    {
      name: "KAT",
      value: "https://www.instagram.com/katghehe/\n(moderation, hosting)",
      inline: false
    },
    {
      name: "ALEC",
      value: "https://www.instagram.com/aulec/\n(moderation, hosting, dog-petter)",
      inline: false
    },
    {
      name: "RIAN",
      value: "https://www.instagram.com/rianquack/\n(moderation, hosting, quest NPC)",
      inline: false
    },
    {
      name: "VORON",
      value: "(story & writing support)",
      inline: false
    },
    {
      name: "CHEN",
      value: "https://www.instagram.com/chen_dll/ \n (moderation, quest NPC, pigeon enjoyer)",
      inline: false
    },
    {
      name: "✂ SPECIAL CREDITS -",
      value: "**DIV** DESIGNER OF SCISSORCHAN FOR KIMO 6\nhttps://www.instagram.com/devoidd/\n",
      inline: false
    },
  )
  .setColor("#ff4000");

    // if (interaction.isButton()) {
    //     interaction.deferUpdate();
    //     return interaction.message.edit({ content: '', embeds: [embed] , ephemeral: true, components: [await rulesButtons(customID)] });
    // }

    interaction.reply({ content: '', embeds: [embed] , ephemeral: true, components: [await rulesButtons(customID)] });

};
