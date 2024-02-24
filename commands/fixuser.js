const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserState = require('../models/userState');
const UserData = require('../models/userData');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID, safeRoleID } = require('../ids.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('fix')
    .setDescription('fix a user')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('the user to fix.')
            .setRequired(true)),

    async execute(interaction, client) {

        if(!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator) && !interaction.member.roles.cache.get('1202555128352346143')){
            await interaction.reply({content: "You must be an administrator or lifeguard to perform this action.", ephemeral: true});
            return;
        }

        const target = interaction.options.getMember('target');

        let stateInfo = await UserState.findOne ({ userID: target.id });
        let dataInfo = await UserData.findOne ({ userID: target.id });

        if (!stateInfo) {
            // create new 
            stateInfo = new UserState ({
                userID: target.id,
                currentState: 'DANGER',
                lastPostTime: 0,
                postedToday: false,
            })
        }

        await stateInfo.save();

        const dice = Math.floor(Math.random () * 2);

        if (!dataInfo) {
            // create new
            dataInfo = new UserData ({
                userID: target.id,
                group: dice,
            })
        }

        await dataInfo.save();

        if (dataInfo.group === 0) {
            target.roles.add('1202551817708507136');
            target.roles.remove('1202876101005803531');
            const announcementChannel = interaction.guild.channels.cache.get('1202622607250296832');
            await announcementChannel.send(`${target} has arrived.`);
        }
        else {
            target.roles.remove('1202551817708507136');
            target.roles.add('1202876101005803531');
            const announcementChannel = interaction.guild.channels.cache.get('1202876942714544148');
            await announcementChannel.send(`${target} has arrived.`);
        }

        if (stateInfo.currentState === 'DANGER') {
            target.roles.add(dangerRoleID);
            target.roles.remove(safeRoleID);
            target.roles.remove(deadRoleID);
        }

        if (stateInfo.currentState === 'SAFE') {
            target.roles.remove(dangerRoleID);
            target.roles.add(safeRoleID);
            target.roles.remove(deadRoleID);
        }

        if (stateInfo.currentState === 'DEAD') {
            target.roles.remove(dangerRoleID);
            target.roles.remove(safeRoleID);
            target.roles.add(deadRoleID);
        }

        interaction.reply ({content: `fixing ${target}`, ephemeral: false});


    },
  };

