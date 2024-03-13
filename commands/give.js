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
        
        const now = Date.now();
        const cooldownAmount = 5000;

        if (cooldowns.has(interaction.member.user.id)) {
            const expirationTime = cooldowns.get(interaction.member.user.id) + cooldownAmount;

            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000 / 60;
              return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more minutes before giving shells again`, ephemeral: true});
            }
        }

        await interaction.deferReply();

        const transferAmount = interaction.options.getInteger('amount');

        if (transferAmount <= 0) return interaction.editReply({ content: 'invalid amount', ephemeral: true });

        const userResult = await UserData.findOne({ userID: interaction.member.user.id });
        if (userResult.money < transferAmount) return interaction.editReply({ content: 'insufficient shells...', ephemeral: true });

        const target = interaction.options.getMember('target');
        const targetResult = await UserData.findOne({ userID: target.id });

        if (target.id === interaction.member.id) return interaction.editReply({ content: `You cannot give to yourself.`, ephemeral: true});

        if (!targetResult) {
            targetResult = new UserData({ 
                userID: target.user.id,
            })
        }


        // 6 hours in milliseconds

        cooldowns.set(interaction.member.user.id, now);

        targetResult.money += transferAmount;
        userResult.money -= transferAmount;

        await targetResult.save();
        await userResult.save();

        interaction.editReply({ content: `${target.displayName} given ${transferAmount} Shells`, ephemeral: false });

    },
  };

