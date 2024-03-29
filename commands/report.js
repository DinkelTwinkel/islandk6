const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('report to admins')
    .addStringOption(option =>
      option
          .setName('contents')
          .setDescription('what you want to report')
          .setRequired(true)),

    async execute(interaction, client) {

      const backRooms = client.guilds.cache.get('1063167135939039262');
      const reportChannel = backRooms.channels.cache.get('1202899220588265533');

      const embed = new EmbedBuilder ()
      .setDescription (`REPORT RECEIVED: ${interaction.member}\n ` + "```" + interaction.options.getString('contents') + "```");

      reportChannel.send({content: '', embeds: [embed] });
      interaction.reply({ content: `report sent! thank you.`, ephemeral: true });

    },
  };
