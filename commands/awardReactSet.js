const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('awardreactset')
    .setDescription('set your default award react ⭐')
    .addIntegerOption(option =>
        option
            .setName('amount')
            .setDescription('amount of shells to give')
            .setRequired(true)),

    async execute(interaction, client) {

        // QUEST NPC ROLE CHECK
        if (!interaction.member.roles.cache.get('1203377553763475497')) return interaction.reply({ content: 'Only npcs can use this...', ephemeral: true });

        const awardAmount = interaction.options.getInteger('amount');

        const result = await UserData.findOne({ userID: interaction.member.id });
        result.emojiReactAwardAmount = awardAmount;

        await result.save();

        interaction.reply({ content: `Updated emoji react award amount! ⭐ React with star to award users with this amount. Be careful of accidental use!`, ephemeral: true });


    },
  };

