const KimoTracker = require('../models/kimoTracker');
const { EmbedBuilder } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const UserState = require('../models/userState');

module.exports = async (client) => {

    const KimoServer = await client.guilds.fetch(kimoServerID);
    const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    const postDailyChannel = KimoServer.channels.cache.get(kimoChannelID);

    sendMessage('BEGINNING FORCE RECHECK', botLogChannel);

    // get next date and minute current cycle length.

    const tracker = await KimoTracker.findOne({ serverId: kimoServerID });
    const nextDateUtcMil = tracker.nextDate;
    const period = tracker.currentPeriodLength;
    const previousDateUtcMil = nextDateUtcMil - period;

    const messages = await getAllMessagesInChannel(postDailyChannel)
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
                if (result.currentState === 'DANGER') {
                    sendMessage(`STATE MISMATCH DETECTED, CHANGING TO SAFE FOR ${member}`, botLogChannel);
                    result.currentState = 'SAFE';
                    await result.save();
                    botLogChannel.send(`!updatestate ${member.id}`);
                }
            }
            else {
                //sendMessage(`❌POST NOT FOUND FOR MEMBER: ${member}`, botLogChannel);
                // check if current state is DANGER, if not fix it.
                if (result.currentState === 'SAFE') {
                    sendMessage(`STATE MISMATCH DETECTED, CHANGING TO DANGER FOR ${member}`, botLogChannel);
                    result.currentState = 'DANGER';
                    await result.save();
                    botLogChannel.send(`!updatestate ${member.id}`);
                }
            }
            count += 1;
        }
    });

    // const intervalId = setInterval(async () => {

    //     console.log (count);

    //     if (totalMembers <= count) {
    //         sendMessage(`RECHECK COMPLETE✅`, botLogChannel);
    //         clearInterval(intervalId);
    //     }
        
    // }, 1000);
    

    // Get all members who are currently safe or in danger.
    // for each member, scan through the filtered messages for their author id. If not found, set to danger, if found set to safe.

    // 

};

async function sendMessage (message, channel) {
    const embed = new EmbedBuilder()
    .setColor('Blurple')
    .setDescription(message);
    await channel.send({embeds: [embed] });
}