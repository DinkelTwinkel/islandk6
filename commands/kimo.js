const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed, EmbedBuilder } = require('discord.js');
const rulesKimoState = require('../patterns/rulesKimoState');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kimo')
    .setDescription('kimo information'),

    async execute(interaction, client) {

        rulesKimoState(client, interaction, 'rulesKimo')

    },
  };



