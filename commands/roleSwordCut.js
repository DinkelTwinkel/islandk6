const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const cost = 10;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('cut')
    .setDescription('cut someone')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('target to cut (costs 10 shells)')
            .setRequired(true)),

    async execute(interaction, client) {

        // QUEST NPC ROLE CHECK
        if (!interaction.member.roles.cache.get('1216662066220367903')) return interaction.reply({ content: 'You need a sword to use this.', ephemeral: true });

        const userWallet = await UserData.findOne({ userID: interaction.member.id });
        if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to use this.`, ephemeral: true });
        userWallet.money -= cost;
        await userWallet.save();

        const target = interaction.options.getMember('target');

        const oldName = target.displayName;

        const targetName = randomlyModifyString(target.displayName);

        target.setNickname = targetName;

        const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
        jianDaoWallet.money += 10;
        await jianDaoWallet.save();

        interaction.reply({ content: `${oldName} has been cut! Their new name is ${targetName}`, ephemeral: false });

    },
  };

function randomlyModifyString(str) {
    // Check if the string has multiple words
    const words = str.split(" ");
    if (words.length > 1) {
      // If multiple words, randomly remove a word
      const randomIndex = Math.floor(Math.random() * words.length);
      words.splice(randomIndex, 1);
      return words.join(" ");
    } else {
      // If only one word, randomly cut it in half
  // Generate a random index to split the string
  const splitIndex = Math.floor(Math.random() * str.length);
  
  // Slice the string at the random index
  const firstHalf = str.slice(0, splitIndex);
  const secondHalf = str.slice(splitIndex);

  if (Math.random() > 0.5) {
    return firstHalf;
  }
  else {
    return secondHalf;
  }
    }
  }