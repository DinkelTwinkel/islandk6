const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed, EmbedBuilder } = require('discord.js');
const statEmbed = require('../patterns/statEmbed');
const PostTime = require('../models/averageposttimes');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mystatistics')
    .setDescription('your statistics'),

    async execute(interaction, client) {

        await interaction.deferReply({ephemeral: true})

        let averagePostMinute = 0;
        let averagePostUtcSeconds = 0;

        const postTime = await PostTime.findOne({ userID: interaction.member.id });
        if (postTime) {


            const now = new Date()
            now.setHours(12);
            now.setMinutes(0);
            now.setSeconds(0);
            now.setMilliseconds(0);

            averagePostMinute = postTime.averagePostTime/1000/60;
            averagePostUtcSeconds = (now.getTime() - postTime.averagePostTime)/1000;
            //

        }
        interaction.editReply({ content: `Average Post Time: <t:${Math.floor(averagePostUtcSeconds)}:T>`, embeds: [await statEmbed(interaction.member)], ephemeral: true })

    },
  };



