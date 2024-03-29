const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const UserStats = require('../models/userStatistics');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bottle')
    .setDescription('put a message in a bottle! (Costs 5 shells)')
    .addStringOption(option =>
        option
            .setName('message')
            .setDescription('message for someone somewhere to find... bad messages are deleted.')
            .setRequired(true)),

    async execute(interaction, client) {

        await interaction.deferReply({ephemeral: true});

        // money check.

        const cost = 5;

        const userWallet = await UserData.findOne({ userID: interaction.member.id });
        if (userWallet.money < cost) return interaction.editReply({ content: `Insufficient shells, you need ${cost} shells to use this.`, ephemeral: true });

        userWallet.money -= cost;
        await userWallet.save();

        // bottle channel. Send message there. 
        // create embed to say which user did it.

        const backRooms = client.guilds.cache.get('1063167135939039262');
        const cookieChannel = backRooms.channels.cache.get('1200757419454758953');

        const embed = new EmbedBuilder()
        .setDescription(`fortune added by: ${interaction.member}`);
    
        cookieChannel.send({content: interaction.options.getString('message'), embeds: [embed]});

        interaction.editReply({ content: `Message bottled! bad or abusive messages are removed!`, ephemeral: true });

        // user statistics total kimo posting tracking

        const userStats = await UserStats.findOne({ userID: interaction.member.user.id });
        userStats.messagesBottled += 1;
        await userStats.save();

        // 

    },
  };

