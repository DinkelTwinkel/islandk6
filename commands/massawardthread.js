const { SlashCommandBuilder } = require('discord.js');
const UserData = require('../models/userData');
const getAllMessagesInChannel = require('../patterns/getAllMessagesInChannel');

const imageExtensions = ['.BMP', '.JPEG', '.JPG', '.TIFF', '.SVG', '.PNG', '.PNG', '.WEBP'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('massawardthread')
		.setDescription('award everyone in a thread who has posted an image')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('the last x amount of messages')
                .setRequired(true),
        ),
async execute(interaction) {

    if (!interaction.member.roles.cache.get('1203377553763475497')) return interaction.reply ({content: 'Only quest npcs can use this.', ephemeral: true});

    const awardAmount = interaction.options.getInteger('amount');
    await interaction.guild.members.fetch();

    interaction.reply(`Awarding everyone in thread ${awardAmount} coins **each**...`);

            // Create a Set to keep track of processed users
        const processedUsers = new Set();

        // Get the thread channel object
        const threadChannel = interaction.channel;

        // Get all the messages in the thread
        const messages = await getAllMessagesInChannel(threadChannel);


        messages.forEach(message => {
        const user = message.author;

        message.attachments.forEach(attachment => {
                // 'some()' will return true of any 'attachment' objects ends with an element from 'imageExtensions'
                console.log('before file extention check');
                if (imageExtensions.some(ext => attachment.name.toUpperCase().endsWith(ext))) {
                    // effectively detected a image post.
                    if (!processedUsers.has(user.id) && !user.bot) {
                        const member = message.guild.members.cache.get(user.id);
                        giveMoney(member, awardAmount);
                        interaction.channel.send(`${member.displayName} granted ${awardAmount} Coins`);
                        processedUsers.add(user.id);
                    }
                }
        });


        });


	},
};

async function giveMoney(member, money) {

    const result = await UserData.findOne({ userID: member.user.id });
    try {
        if (!result) return;
        result.money += money;
        await result.save();
    }
    catch (err) {
        console.log(err);
    }

}