const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('therapyquestion')
    .setDescription('ask secretly.')
    .addStringOption(option =>
      option
          .setName('contents')
          .setDescription('what you want to ask')
          .setRequired(true)),

    async execute(interaction, client) {

      const backRooms = client.guilds.cache.get('1063167135939039262');
      const reportChannel = backRooms.channels.cache.get('1206961020782780466');

      const embed = new EmbedBuilder ()
      .setDescription (`QUESTION RECEIVED: ${interaction.member}\n ` + "```" + interaction.options.getString('contents') + "```");

      reportChannel.send({content: '', embeds: [embed] });
      interaction.reply({ content: `question sent! thank you.`, ephemeral: true });

    },
  };
