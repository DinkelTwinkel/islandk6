const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('tourism')
    .setDescription('🎫 Visit the other Island [400 seashells] Lasts until next cut off.'),

    async execute(interaction, client) {

        if (interaction.member.roles.cache.get('1211141295666495508')) return interaction.reply({ content: `You already have a tourism pass.`, ephemeral: true });

        // money check.

        const cost = 400;

        const userWallet = await UserData.findOne({ userID: interaction.member.id });
        if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to use this.`, ephemeral: true });

        userWallet.money -= cost;
        await userWallet.save();

        interaction.member.roles.add('1211141295666495508');

        if (userWallet.group === 0) {
            //group a
            announcementChannel = interaction.guild.channels.cache.get('1202622607250296832');
            await announcementChannel.send(`A tourist has has arrived. Welcome ${interaction.member}`);
          }
          else if (userWallet.group === 1) {
            //group b
            announcementChannel = interaction.guild.channels.cache.get('1202876942714544148');
            await announcementChannel.send(`A tourist has has arrived. Welcome ${interaction.member}`);
          }

        // add role.

        interaction.reply({ content: `Tourism pass obtained! You may now see the other island. This will last until the next cut off!`, ephemeral: true });

    },
  };

