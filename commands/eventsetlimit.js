const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const { kimoServerID } = require('../ids.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('eventsetlimit')
    .setDescription('set event channel user limit')
    .addIntegerOption(option =>
        option
            .setName('userlimit')
            .setDescription('limit, 0 means no limit')
            .setRequired(true)),

    async execute(interaction, client) {

        // HOST ROLE CHECK
        if (!interaction.member.roles.cache.get('1203384520976502824')) return interaction.reply({ content: 'Only hosts can use this...', ephemeral: true });

        if (interaction.options.getInteger('userlimit') > 99) return interaction.reply({ content: 'only 0 - 99 valid. 0 is no cap.', ephemeral: true });

        const KimoServer = await client.guilds.fetch(kimoServerID);
        const eventChannel = KimoServer.channels.cache.get('1203390855722041354');

        await eventChannel.setUserLimit(interaction.options.getInteger('userlimit'));

        interaction.reply({ content: `Channel Limit updated`, ephemeral: true });

    },
  };

