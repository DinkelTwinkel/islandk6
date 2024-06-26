const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require('discord.js');
const rulesFigure = require('../patterns/rulesFigure');
const UserData = require('../models/userData');
const cost = 0;
const roleID = '1222356077316673677'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('gun')
    .setDescription(`Cosmetic: costs ${cost} shells. If you already have this, you can exchange it for ${Math.floor (cost * 0.75)} shells.`),

    async execute(interaction, client) {

        if (!interaction.member.roles.cache.get(roleID)) {
            // buy
            // const userWallet = await UserData.findOne({ userID: interaction.member.id });
            // if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to use this.`, ephemeral: true });
            // userWallet.money -= cost;
            // await userWallet.save();

            // const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
            // jianDaoWallet.money += cost;
            // await jianDaoWallet.save();

            interaction.member.roles.add(roleID);

            interaction.reply({ content: `Role Gained!`, ephemeral: true });

        }
        else if (interaction.member.roles.cache.get(roleID)) {
            // sell
            // const userWallet = await UserData.findOne({ userID: interaction.member.id });
            // userWallet.money += Math.floor (cost * 0.75);
            // await userWallet.save();

            // const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
            // jianDaoWallet.money -= Math.floor (cost * 0.75);
            // await jianDaoWallet.save();

            interaction.member.roles.remove(roleID);

            interaction.reply({ content: `Role removed!`, ephemeral: true });

        }

    },
  };

