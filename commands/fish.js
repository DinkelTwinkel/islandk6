const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const getAllMessagesInChannel = require('../patterns/getAllMessagesInChannel');
const Stats = require('../models/statistics');
const UserStats = require('../models/userStatistics');

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

      // source finder and isolator
      // const source = randomMessage.embeds[0].data.footer.text;
      // const index = source.indexOf("SOURCE:") + "SOURCE: ".length;
      // const result = source.substring(index);

      // console.log (result);

      interaction.editReply({ content: '', embeds: [randomMessage.embeds[0]], files: [{ attachment: attachment.url }], ephemeral: true });

      console.log (randomMessage.embeds[0].data.description);
      console.log (randomMessage.embeds[0].data.footer.text);
      //content: '🎣' + randomMessage.url,

      const text = randomMessage.embeds[0].data.description;
      const numbers = text.match(/\d+/g);
      const numbersString = numbers.join("");

      console.log(numbersString);

      // user numberString to find user in userdata and reward them one shell.

      const result = await UserData.findOne({ userID: numbersString });
      result.money += 1;
      await result.save();
      console.log (`rewarding ${numbersString} for fish`);

      const statTracker = await UserStats.findOne({ userID: interaction.member.id })
      statTracker.fishcaught += 1;
      await statTracker.save();

    },
  };

