const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('applyhost')
    .setDescription('apply for hosting an event')
    .addStringOption(option =>
      option
          .setName('contents')
          .setDescription('what you want to report')
          .setRequired(true)),

    async execute(interaction, client) {

      const backRooms = client.guilds.cache.get('1063167135939039262');
      const reportChannel = backRooms.channels.cache.get('1210269615595323454');

      const embed = new EmbedBuilder ()
      .setDescription (`host application recieved: ${interaction.member}\n ` + "```" + interaction.options.getString('contents') + "```");

      reportChannel.send({content: '', embeds: [embed] });
      interaction.reply({ content: `Application sent! thank you.`, ephemeral: true });

    },
  };
