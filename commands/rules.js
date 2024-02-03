const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require('discord.js');
const rulesRules = require('../patterns/rulesRules');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('rules'),

    async execute(interaction, client) {

        rulesRules(client, interaction, 'rulesRules');

    },
  };

