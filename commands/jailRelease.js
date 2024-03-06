const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed, EmbedBuilder } = require('discord.js');
const rulesKimoState = require('../patterns/rulesKimoState');
const Jail = require('../models/jailTracker');
const jailRelease = require('../patterns/jailRelease');
const { adminRoleID, jailedRoleID } = require('../ids.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('release')
        .setDescription('release someone from jail.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('to jail')
                .setRequired(true)),

    async execute(interaction, client) {

        if (!interaction.member.roles.cache.get(adminRoleID)) return interaction.reply({ content: `you cannot use this...`, ephemeral: true });

        const jailTarget = interaction.options.getMember('target');

        if (!jailTarget.roles.cache.get(jailedRoleID))
            return interaction.reply({ content: `You cannot release someone not in jail!`, ephemeral: true });

        jailRelease(client, jailTarget);

        interaction.reply({ content: `${jailTarget.displayName} released from jail! `, ephemeral: true });
        
    },
  };



