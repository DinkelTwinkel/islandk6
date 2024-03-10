const KimoTracker = require('../models/kimoTracker');
const { EmbedBuilder } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const UserState = require('../models/userState');
const getAllMessagesInChannelLastTwoDays = require('./getAllMessagesInChannelLastTwoDays');

module.exports = async (client) => {

    const KimoServer = await client.guilds.fetch(kimoServerID);
    const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    const postDailyChannel = KimoServer.channels.cache.get(kimoChannelID);

    sendMessage('BEGINNING FORCE RECHECK', botLogChannel);

    //channelLock (client);

    // get next date and minute current cycle length.

    setTimeout(async () => {
        
        const tracker = await KimoTracker.findOne({ serverId: kimoServerID });
        const nextDateUtcMil = tracker.nextDate;
        const period = tracker.currentPeriodLength;
        const previousDateUtcMil = nextDateUtcMil - (2 * period);

        const messages = await getAllMessagesInChannelLastTwoDays(postDailyChannel)
        // Filter the messages by creation date
        let filteredMessages = messages.filter(msg => msg.createdAt.getTime() > previousDateUtcMil);
        filteredMessages = filteredMessages.filter(msg => !msg.author.bot);

        // filter out all messages to just those from after the cycle.

        const members = await KimoServer.members.fetch();

        sendMessage(`MEMBERS FETCHED: ${members.size}`, botLogChannel);

        let count = 0;
        //const allDangerStates = await UserState.find({ currentState: 'DANGER' });
        let totalMembers = members.size;
        
        members.forEach(async member => {

            if (member.user.bot) return totalMembers -= 1;
            if (member.user.id === member.guild.ownerId) return totalMembers -= 1;
            if (member.roles.cache.get('1209326206151819336')) return totalMembers -= 1;

            // await sendMessage(`CHECKING MEMBER: ${member}`, botLogChannel);
            
            const result = await UserState.findOne({ userID: member.user.id });

            if (!result) return //  sendMessage(`NO STATE DATA FOR ${member} FOUND`, botLogChannel);
            if (result.currentState != 'DEAD') {

                let postFound = false;

                filteredMessages.forEach(message => {
                    if (message.author.id === member.user.id) {
                        postFound = true;
                    }
                });

                if (postFound === true) {
                    //sendMessage(`✅POST FOUND FOR MEMBER: ${member}`, botLogChannel);
                    // check if current state is SAFE, if not fix it.
                    // if (result.currentState === 'DANGER') {
                    //     sendMessage(`STATE MISMATCH DETECTED, CHANGING TO SAFE FOR ${member}`, botLogChannel);
                    //     result.currentState = 'SAFE';
                    //     await result.save();
                    //     botLogChannel.send(`!updatestate ${member.id}`);
                    // }

                    // if (member.roles.cache.get ('1202533924040081408')) {
                    //     member.roles.add ('1202533882822397972');
                    //     member.roles.remove ('1202533924040081408');
                    // }
                }
                else {
                    //sendMessage(`❌POST NOT FOUND FOR MEMBER: ${member}`, botLogChannel);
                    // check if current state is DANGER, if not fix it.
                        sendMessage(`POST NOT FOUND FROM PREVIOUS DAY, CHANGING TO DEAD FOR ${member}`, botLogChannel);
                        result.currentState = 'DEAD';
                        await result.save();
                        botLogChannel.send(`!updatestate ${member.id}`);

                    
                }
                count += 1;
            }
            if (result.currentState === 'DEAD') {
                botLogChannel.send(`!updatestate ${member.id}`);
            }
        });

        // setTimeout(() => {
        //     channelUnLock (client);
        // }, 60 * 1000 * 2);

    }, 5000);

};

async function sendMessage (message, channel) {
    const embed = new EmbedBuilder()
    .setColor('Blurple')
    .setDescription(message);
    await channel.send({embeds: [embed] });
}

async function channelLock (client) {
    // lock channel, timeout for 10mins, post quote, unlock.
    const KimoServer = await client.guilds.fetch(kimoServerID);
    const postDailyChannel = KimoServer.channels.cache.get('1193665461699739738');

    const PartARole = KimoServer.roles.cache.get('1202551817708507136');
    const PartBRole = KimoServer.roles.cache.get('1202876101005803531');

    postDailyChannel.permissionOverwrites.edit(PartARole, { SendMessages: false });
    postDailyChannel.permissionOverwrites.edit(PartBRole, { SendMessages: false });
    postDailyChannel.send ('# AUTO RESCANNING! CHANNEL LOCKED FOR 2MINS 🔒');

}


async function channelUnLock (client) {
    // lock channel, timeout for 10mins, post quote, unlock.
    const KimoServer = await client.guilds.fetch(kimoServerID);
    const postDailyChannel = KimoServer.channels.cache.get('1193665461699739738');

    const PartARole = KimoServer.roles.cache.get('1202551817708507136');
    const PartBRole = KimoServer.roles.cache.get('1202876101005803531');

    postDailyChannel.permissionOverwrites.edit(PartARole, { SendMessages: true });
    postDailyChannel.permissionOverwrites.edit(PartBRole, { SendMessages: true });
    postDailyChannel.send('# RECHECK COMPLETE');
    postDailyChannel.send('** Channel Lock Released 🔓 Thank You for Patience. **');

}