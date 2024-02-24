const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('d20')
    .setDescription('throw a d20!'),

    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: false });
        await interaction.editReply({ content: 'tossing ... :coin:' });

        const dice = Math.floor(Math.random() * 20) + 1;

        setTimeout(() => {
            interaction.editReply({ content: `${dice}` });
        }, 1000);
    },
  };

