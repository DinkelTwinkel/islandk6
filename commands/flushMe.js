const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserState = require('../models/userState');
const UserData = require('../models/userData');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID, safeRoleID } = require('../ids.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('flush')
    .setDescription('if your dead you can self flush.'),

    async execute(interaction, client) {

        if(!interaction.member.roles.cache.get('1202533941727203368')){
            await interaction.reply({content: "You must be dead to use this.", ephemeral: true});
            return;
        }

        interaction.member.kick();

        const KimoServer = await client.guilds.fetch(kimoServerID);
        const botLogChannel = KimoServer.channels.cache.get('1202633424381153300');


        interaction.channel.send ({content: `${target} has been flushed`, ephemeral: false});
        botLogChannel.send ({content: `${target} has been flushed`, ephemeral: false});

        interaction.reply('Good bye.');


    },
  };

