const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('cointoss')
    .setDescription('toss a coin to your witcher...'),

    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: false });
        await interaction.editReply({ content: 'tossing ... :coin:' });

        setTimeout(() => {
            interaction.editReply({ content: `${flipCoin()}` });
        }, 1000);
    },
  };

  function flipCoin() {
    // Generate a random number (0 or 1)
    const randomNumber = Math.floor(Math.random() * 2);
    
    // If the random number is 0, it's heads, otherwise it's tails
    if (randomNumber === 0) {
      return "Heads";
    } else {
      return "Tails";
    }
  }