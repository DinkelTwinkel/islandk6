const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('role a dice'),

    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: false });
        await interaction.editReply({ content: 'rolling dice... 🎲' });

        const dice = Math.floor(Math.random() * 6) + 1;

        setTimeout(() => {
            interaction.editReply({ content: `${dice}` });
        }, 1000);
    },
  };

