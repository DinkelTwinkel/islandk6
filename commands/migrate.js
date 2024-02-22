const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserState = require('../models/userState');
const UserData = require('../models/userData');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID, safeRoleID } = require('../ids.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('migrate')
    .setDescription('migrate user to other island')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('the user to migrate')
            .setRequired(true)),

    async execute(interaction, client) {

        if(!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator) && !interaction.member.roles.cache.get('1202555128352346143')){
            await interaction.reply({content: "You must be an administrator or lifeguard to perform this action.", ephemeral: true});
            return;
        }

        const target = interaction.options.getMember('target');

        let dataInfo = await UserData.findOne ({ userID: target.id });

        if (!dataInfo) {
            // create new
            dataInfo = new UserData ({
                userID: target.id,
                group: dice,
            })
        }

        if (dataInfo.group === 0) {
            dataInfo.group = 1;
            target.roles.remove('1202551817708507136');
            target.roles.add('1202876101005803531');
            const announcementChannel = interaction.guild.channels.cache.get('1202876942714544148');
            await announcementChannel.send(`${target} has arrived.`);
        }
        else {
            dataInfo.group = 0;
            target.roles.add('1202551817708507136');
            target.roles.remove('1202876101005803531');
            const announcementChannel = interaction.guild.channels.cache.get('1202622607250296832');
            await announcementChannel.send(`${target} has arrived.`);
        }
        await dataInfo.save();

        interaction.reply ({content: `migrating ${target}`, ephemeral: true});


    },
  };

