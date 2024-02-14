const { EmbedBuilder, Events } = require('discord.js');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');

module.exports = async (client) => {

    client.on(Events.MessageCreate, async (message) => {

        if (message.member.user.bot) return;

        const dice = Math.random() * 100;
        const findEntryChance = 5;

        console.log (dice);
        const journalEntrySelfDeleteTimer = 10;

        if (findEntryChance > dice) {

            // reply with journal entry. Self delete.

            const embed = new EmbedBuilder()
            .setDescription('```' + await getFortuneCookie(client) + '```')
            .setFooter({
                text: `Scattered Journal`,
            });
            const confirmationMessage = await message.reply({embeds: [embed]})
            // setTimeout(() => {
            //     confirmationMessage.delete();
            // }, journalEntrySelfDeleteTimer * 1000);
                        
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