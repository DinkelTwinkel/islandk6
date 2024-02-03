const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('change your nickname! [requires 10 shells] ')
    .addStringOption(option =>
      option
          .setName('name')
          .setDescription('new name')
          .setRequired(true)),

    async execute(interaction, client) {

      const cost = 10;

      const userWallet = await UserData.findOne({ userID: interaction.member.id });
      if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to use this.`, ephemeral: true });

      userWallet.money -= cost;
      await userWallet.save();

      interaction.member.setNickname(limitString(interaction.options.getString('name'), 32));

      interaction.reply({ content: `name changed!`, ephemeral: true });

    },
  };

  function limitString(inputString, maxLength) {
    if (inputString.length <= maxLength) {
      // If the string is within the limit, return it as is
      return inputString;
    } else {
      // If the string exceeds the limit, truncate it
      return inputString.slice(0, maxLength);
    }
  }