const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('give someone seashells')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('tranfer shells to them')
            .setRequired(true))
    .addIntegerOption(option =>
        option
            .setName('amount')
            .setDescription('amount of shells to give')
            .setRequired(true)),

    async execute(interaction, client) {

        const cooldownAmount = 5000;

        if (cooldowns.has(interaction.member.user.id)) {
            const expirationTime = cooldowns.get(interaction.member.user.id) + cooldownAmount;

            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000 / 60;
              return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more minutes before showing ID again`, ephemeral: true});
            }
        }

        const transferAmount = interaction.options.getInteger('amount');

        if (transferAmount <= 0) return interaction.reply({ content: 'invalid amount', ephemeral: true });

        const userResult = await UserData.findOne({ userID: interaction.member.user.id });
        if (userResult.money < transferAmount) return interaction.reply({ content: 'insufficient shells...', ephemeral: true });

        const target = interaction.options.getMember('target');
        const targetResult = await UserData.findOne({ userID: target.id });

        if (target.id === interaction.member.id) return interaction.reply({ content: `You cannot give to yourself.`, ephemeral: true});

        if (!targetResult) {
            targetResult = new UserData({ 
                userID: target.user.id,
            })
        }

        const now = Date.now();
        // 6 hours in milliseconds

        cooldowns.set(interaction.member.user.id, now);

        targetResult.money += transferAmount;
        userResult.money -= transferAmount;

        await targetResult.save();
        await userResult.save();

        interaction.reply({ content: `${target.displayName} given ${transferAmount} Shells`, ephemeral: false });

    },
  };

