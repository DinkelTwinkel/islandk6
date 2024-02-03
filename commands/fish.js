const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const getAllMessagesInChannel = require('../patterns/getAllMessagesInChannel');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('fish')
    .setDescription('fish for a random ref!'),

    async execute(interaction, client) {

      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({ content: 'fishing in progress... 🎣' });

      // costs one shell. 
      // look through channel, Get all messages. Pick random. Get first attachment?
      kimoServer = await client.guilds.fetch('1193663232041304134');
      const refChannel1 = kimoServer.channels.cache.get('1202622867863506945');
      

      const messages = await getAllMessagesInChannel(refChannel1);
      const randomIndex = Math.floor(Math.random() * messages.length);
      const randomMessage = Array.from(messages)[randomIndex];

      const attachment = randomMessage.attachments.first();

      //content: '🎣' + randomMessage.url,

      interaction.editReply({ content: '', embeds: [randomMessage.embeds[0]], files: [{ attachment: attachment.url }], ephemeral: true });

    },
  };

