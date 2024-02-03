const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed, EmbedBuilder } = require('discord.js');
const rulesKimoState = require('../patterns/rulesKimoState');
const Jail = require('../models/jailTracker');
const jail = require('../patterns/jail');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('jail')
    .setDescription('jail someone.')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('to jail')
            .setRequired(true))
    .addIntegerOption(option =>
        option
            .setName('time')
            .setDescription('minutes to jail')
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName('reason')
            .setDescription('reason for jailing')
            .setRequired(true)),

    async execute(interaction, client) {

        if (!interaction.member.roles.cache.get('1203377553763475497')) return interaction.reply({ content: `you cannot use this...`, ephemeral: true });

        const jailTarget = await interaction.options.getMember('target');

        if (jailTarget.roles.cache.get('1202749571957006348')) return interaction.reply({ content: `You cannot jail someone already in Jail!`, ephemeral: true });

        jail(client, jailTarget, interaction.options.getString('reason'), interaction.member, interaction.options.getInteger('time'));

        interaction.reply({ content: `${jailTarget.displayName} has been sent to the dungeon!`, ephemeral: true });
    },
  };



