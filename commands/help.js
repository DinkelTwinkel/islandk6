const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require('discord.js');
const rulesRules = require('../patterns/rulesRules');
const rulesCommands = require('../patterns/rulesCommands');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('text commands'),

    async execute(interaction, client) {

        rulesCommands(client, interaction, 'rulesCommands');

    },
  };

