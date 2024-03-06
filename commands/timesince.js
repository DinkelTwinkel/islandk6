const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const cooldowns = new Map();
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const getAllMessagesInChannel = require('../patterns/getAllMessagesInChannel');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timesincedaily')
    .setDescription('time since a message was posted')
    .addStringOption(option =>
        option
            .setName('messageid')
            .setDescription('amount of shells to give')
            .setRequired(true)),

    async execute(interaction, client) {

        if (!interaction.member.roles.cache.get(adminRoleID)) return interaction.reply({ content: `you cannot use this...`, ephemeral: true });

        await interaction.deferReply();

        const KimoServer = await client.guilds.fetch(kimoServerID);
        const dailyChannel = KimoServer.channels.cache.get(kimoChannelID);

        const messageID = interaction.options.getString('messageid');
        const message = await dailyChannel.messages.fetch(messageID);
        const messageCreatedTime = message.createdAt.getTime();
        const utcSeconds = Math.floor(messageCreatedTime/1000);

        const embed = new EmbedBuilder()
        .setDescription(`This message was sent <t:${utcSeconds}:R> on:\n <t:${utcSeconds}:f>`)
        .setImage(message.attachments.first().url);

        if (message) {
            interaction.editReply({content: 'Message Data Retrieved', embeds: [embed]})
        }
        else {
            interaction.editReply({content: `Unable to locate message data. Is the message ID correct?`});
        }


    },
  };

