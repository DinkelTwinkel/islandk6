const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unaward')
    .setDescription('reward someone shells')
    .addIntegerOption(option =>
        option
            .setName('amount')
            .setDescription('amount of shells to remove')
            .setRequired(true))
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('remove shells from them')
            .setRequired(true)),

    async execute(interaction, client) {

        // QUEST NPC ROLE CHECK
        if (!interaction.member.roles.cache.get('1203377553763475497')) return interaction.reply({ content: 'Only npcs can use this...', ephemeral: true });

        const transferAmount = interaction.options.getInteger('amount');

        if (transferAmount <= 0) return interaction.reply({ content: 'invalid amount', ephemeral: true });

        const target = interaction.options.getMember('target');
        let targetResult = await UserData.findOne({ userID: target.id });

        if (!targetResult) {
            targetResult = new UserData({
                userID: target.user.id,
                money: transferAmount,
            })
        }

        targetResult.money -= transferAmount;
        await targetResult.save();

        interaction.reply({ content: `Removed ${transferAmount} Shells from ${target.displayName}`, ephemeral: false });

    },
  };

