const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require('discord.js');
const rulesFigure = require('../patterns/rulesFigure');
const UserData = require('../models/userData');
const cost = 5000;
const roleID = '1216556565914587206'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pineapple')
    .setDescription(`Cosmetic: costs ${cost} shells. If you already have this, you can exchange it for ${cost} shells.`),

    async execute(interaction, client) {

        if (!interaction.member.roles.cache.get(roleID)) {
            // buy
            const userWallet = await UserData.findOne({ userID: interaction.member.id });
            if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to use this.`, ephemeral: true });
            userWallet.money -= cost;
            await userWallet.save();

            interaction.member.roles.add(roleID);

            interaction.reply({ content: `Role Gained!`, ephemeral: true });

        }
        else {
            // sell
            const userWallet = await UserData.findOne({ userID: interaction.member.id });
            userWallet.money += cost;
            await userWallet.save();

            interaction.member.roles.remove(roleID);

            interaction.reply({ content: `Role exchanged for shells!`, ephemeral: true });

        }

    },
  };

