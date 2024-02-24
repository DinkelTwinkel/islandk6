const { Events } = require('discord.js');
const UserData = require('../models/userData');
const rulesKimoState = require('./rulesKimoState');
const rulesFigure = require('./rulesFigure');
const rulesRules = require('./rulesRules');
const rulesCredits = require('./rulesCredits');
const kimoIDMaker = require('./kimoIDMaker');
const rulesCommands = require('./rulesCommands');
const UserState = require('../models/userState');
const cooldowns = new Map();
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID, safeRoleID } = require('../ids.json');

module.exports = async (client) => {

    client.on(Events.InteractionCreate, async (interaction) => {

      if (!interaction.isButton()) return;

      console.log ('buttonclick detected')

      if (interaction.customId === 'rulesKimo') {

        rulesKimoState(client, interaction, interaction.customId);

      }
      else if (interaction.customId === 'rulesRules') {

        rulesRules(client, interaction, 'rulesRules');

      }
      else if (interaction.customId === 'rulesFigure') {

        rulesFigure(client, interaction, interaction.customId);

      }
      else if (interaction.customId === 'rulesCredits') {

        rulesCredits(client, interaction, interaction.customId);

      }
      else if (interaction.customId === 'rulesCommands') {

        rulesCommands(client, interaction, interaction.customId);

      }

      if (interaction.customId === 'showid') {

        const now = Date.now();
        const cooldownAmount = 5 * 60 * 1000;
        // 6 hours in milliseconds

        if (cooldowns.has(interaction.member.user.id)) {
            const expirationTime = cooldowns.get(interaction.member.user.id) + cooldownAmount;

            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000 / 60;
              return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more minutes before showing ID again`, ephemeral: true});
            }
        }
        cooldowns.set(interaction.member.user.id, now);

        console.log(interaction.member.displayAvatarURL());

        interaction.channel.send ({ embeds: [ await kimoIDMaker(interaction.message.content, interaction.member, client)], ephemeral: false });
        return interaction.deferUpdate();
      }

      if (interaction.customId === 'skiptutorial') {

        const target = interaction.member;

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

        interaction.reply ({content: `skipping tutorial for ${target}`, ephemeral: false});

      }

      })
};
