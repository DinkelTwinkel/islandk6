const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('smuggle')
    .setDescription('Smuggle to the other Island [200 seashells] This will end when you next post or when cut off happens!'),

    async execute(interaction, client) {

        // money check.

        const cost = 200;

        const userWallet = await UserData.findOne({ userID: interaction.member.id });
        if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to use this.`, ephemeral: true });

        userWallet.money -= cost;
        await userWallet.save();

        if (userWallet.group === 0) {
            //group a
            interaction.member.roles.remove ('1202551817708507136');
            interaction.member.roles.add ('1202876101005803531');
            announcementChannel = interaction.guild.channels.cache.get('1202876942714544148');
            await announcementChannel.send(`${interaction.member} has been smuggled over...`);
          }
          else if (userWallet.group === 1) {
            //group b
            interaction.member.roles.remove ('1202876101005803531');
            interaction.member.roles.add ('1202551817708507136');
            announcementChannel = interaction.guild.channels.cache.get('1202876942714544148');
            await announcementChannel.send(`${interaction.member} has been smuggled over...`);
          }

        // add role.

        interaction.reply({ content: `Smuggled! You may now see the other island. This will end when you next post or when cut off happens!`, ephemeral: true });

    },
  };

