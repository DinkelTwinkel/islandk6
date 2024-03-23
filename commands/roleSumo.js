const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require('discord.js');
const rulesFigure = require('../patterns/rulesFigure');
const UserData = require('../models/userData');
const cost = 1200;
const roleID = '1221051301996007465'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('sumo')
    .setDescription(`Role: costs ${cost} shells. If you already have this, you can exchange it for ${Math.floor (cost * 0.75)} shells.`),

    async execute(interaction, client) {

        await interaction.deferReply({ephemeral: true});

        if (!interaction.member.roles.cache.get(roleID)) {
            // buy
            const userWallet = await UserData.findOne({ userID: interaction.member.id });
            if (userWallet.money < cost) return interaction.editReply({ content: `Insufficient shells, you need ${cost} shells to use this.`, ephemeral: true });
            userWallet.money -= cost;
            await userWallet.save();

            const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
            jianDaoWallet.money += cost;
            await jianDaoWallet.save();

            interaction.member.roles.add(roleID);

            interaction.editReply({ content: `Role Gained!`, ephemeral: true });

        }
        else if (interaction.member.roles.cache.get(roleID)) {
            // sell
            const userWallet = await UserData.findOne({ userID: interaction.member.id });
            userWallet.money += Math.floor (cost * 0.75);
            await userWallet.save();

            const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
            jianDaoWallet.money -= Math.floor (cost * 0.75);
            await jianDaoWallet.save();

            interaction.member.roles.remove(roleID);

            interaction.editReply({ content: `Role exchanged for shells!`, ephemeral: true });

        }

    },
  };

