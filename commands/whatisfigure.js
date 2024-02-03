const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require('discord.js');
const rulesFigure = require('../patterns/rulesFigure');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('figure')
    .setDescription('what is a figure'),

    async execute(interaction, client) {

        rulesFigure(client, interaction, 'rulesFigure');

    },
  };

