const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hostpass')
    .setDescription('gain the ability to host events'),

    async execute(interaction, client) {


        if (interaction.member.roles.cache.get('1203384520976502824')) return interaction.reply({ content: `You already have a hosting pass.`, ephemeral: true });

        // money check.

        const cost = 500;

        const userWallet = await UserData.findOne({ userID: interaction.member.id });
        if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to use this.`, ephemeral: true });

        userWallet.money -= cost;
        await userWallet.save();

        interaction.member.roles.add('1203384520976502824');

        // add role.

        interaction.reply({ content: `💳 Hosting pass obtained! You can now create events and join the EVENT VOICE CHANNEL. Abusing this power will lead to a spontaneous ban!`, ephemeral: false });

    },
  };

