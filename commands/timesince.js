const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const cooldowns = new Map();
const { kimoChannelID, kimoServerID, adminRoleID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const getAllMessagesInChannel = require('../patterns/getAllMessagesInChannel');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timesincedaily')
    .setDescription('time since a message was posted')
    .addStringOption(option =>
        option
            .setName('messagelink')
            .setDescription('paste message link here')
            .setRequired(true)),
    // .addUserOption(option =>
    //     option
    //         .setName('member')
    //         .setDescription('person to check')
    //         .setRequired(true)),
    

    async execute(interaction, client) {

        if (!interaction.member.roles.cache.get('1202555128352346143')) return interaction.reply({ content: `you cannot use this...`, ephemeral: true });

        await interaction.deferReply();

        const KimoServer = await client.guilds.fetch(kimoServerID);
        const messageLink = interaction.options.getString('messagelink');

        const dailyChannel = KimoServer.channels.cache.get(extractChannelIdFromDiscordLink(messageLink));

        // const target = interaction.options.getMember('member');
        // const allDailies = await getAllMessagesInChannel(dailyChannel);

        // interaction.editReply({content: 'all dailies retrieved'});

        // const filteredMessages = allDailies.filter(msg => msg.author.id == target.id );

        // const latestMessage = filteredMessages.first();

        const messageID = messageLink.substring(69);
        console.log (messageID);
        const message = await dailyChannel.messages.fetch(messageID);
        const messageCreatedTime = message.createdAt.getTime();
        const utcSeconds = Math.floor(messageCreatedTime/1000);

        const embed = new EmbedBuilder()
        .setDescription(`This message was sent <t:${utcSeconds}:R> on:\n <t:${utcSeconds}:f>`);

        if (message.attachments.first().url) {
            embed.setImage(message.attachments.first().url);
        }

        if (message) {
            interaction.editReply({content: 'Message Data Retrieved', embeds: [embed]})
        }
        else {
            interaction.editReply({content: `Unable to locate message data. Is the message ID correct?`});
        }


    },
  };

  function extractChannelIdFromDiscordLink(link) {
    const regex = /channels\/(\d+)\/(\d+)\/(\d+)/;
    const match = link.match(regex);
    if (match && match.length >= 4) {
        return match[2]; // Second captured group is the channel ID
    }
    return null;
}