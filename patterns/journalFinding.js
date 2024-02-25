const { EmbedBuilder, Events } = require('discord.js');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const UserStats = require('../models/userStatistics');

module.exports = async (client) => {

    client.on(Events.MessageCreate, async (message) => {

        if (message.guild.id != '1193663232041304134') return;

        // total message sent tracking:
        // no journal checking in kimo channel.
        if (message.channel.id === '1193665461699739738') return;
        let userStats = await UserStats.findOne({ userID: message.member.user.id });

        if (!userStats) {
            userStats = new UserStats ({
                userID: message.member.user.id,
                totalMessages: 1,
            })
        }
        userStats.totalMessages += 1;
        userStats.lastMessageSent = message.content;
        await userStats.save();

        if (message.member.user.bot) return;

        const dice = Math.random() * 100;
        const findEntryChance = 0.1;

        console.log (dice);
        const journalEntrySelfDeleteTimer = 30;

        if (findEntryChance > dice) {

            // reply with journal entry. Self delete.

            const embed = new EmbedBuilder()
            .setDescription('```\n' + await getFortuneCookie(client) + '```')
            .setFooter({
                text: `Scattered Journal Entries 📜`,
            });
            const confirmationMessage = await message.reply({embeds: [embed]})
            setTimeout(() => {
                confirmationMessage.delete();
            }, journalEntrySelfDeleteTimer * 1000);
                        
        }

    });


};

async function getFortuneCookie(client) {

    const backRooms = client.guilds.cache.get('1063167135939039262');
    const cookieChannel = backRooms.channels.cache.get('1205127427777634324');

    const messages = await getAllMessagesInChannel(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage.content;

  }