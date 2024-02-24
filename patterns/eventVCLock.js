const { Events, Collection } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID } = require('../ids.json');
const UserStats = require('../models/userStatistics');
let hostCurrentInChannel = false;

module.exports = async (client) => {

    client.on(Events.VoiceStateUpdate, async function(oldMember, newMember) {

        const KimoServer = await client.guilds.fetch(kimoServerID);
        // const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    
        const PartARole = KimoServer.roles.cache.get('1202551817708507136');
        const PartBRole = KimoServer.roles.cache.get('1202876101005803531');
        
        //console.log (newMember);

        if (newMember.channelId === '1203390855722041354') {
            console.log ('EventChanneLjoinDetected');

            const member = newMember.guild.members.cache.get(newMember.id);
            const eventChannel = newMember.guild.channels.cache.get(newMember.channelId);
            // console.log (member);

            if (hostCurrentInChannel === false) {
                if (member.roles.cache.get('1203384520976502824')) {

                    // unlock channel for all participants.
                    eventChannel.permissionOverwrites.edit(PartARole, { Connect: true, SendMessages: true });
                    eventChannel.permissionOverwrites.edit(PartBRole, { Connect: true, SendMessages: true });
                    eventChannel.setUserLimit(15);

                    eventChannel.send('Host Detected. **EVENT CHANNEL UNLOCKED**');
                    eventChannel.send(`Welcome to EVENT ROOM ${member}` + '\n```' +  'use /eventsetlimit to change the user limit on this channel.' + '```');

                    hostCurrentInChannel = true;

                }
            }
        }

        if (newMember.channelId === null && oldMember.channelId === '1203390855722041354') {
            
            // user left event vc
            // get channel, check all current members inside channel. if no event host exists, lock channel. Send message to say it.
            const eventChannel = await oldMember.guild.channels.cache.get(oldMember.channelId);

            // console.log (eventChannel);
            // console.log (eventChannel);
            const currentMembers = await eventChannel.members;
            hostCurrentInChannel = false;
            
            if (currentMembers) {

                await currentMembers.forEach(member => {
                    if (member.roles.cache.get('1203384520976502824')) {
                        hostCurrentInChannel = true;
                    }
                });

            }

            if (hostCurrentInChannel === false) {

                eventChannel.permissionOverwrites.edit(PartARole, { Connect: false, SendMessages: false });
                eventChannel.permissionOverwrites.edit(PartBRole, { Connect: false, SendMessages: false });

                eventChannel.send('All hosts have left the chat. **EVENT CHANNEL LOCKED**');
                eventChannel.setUserLimit(1);

                await currentMembers.forEach(member => {
                    member.voice.disconnect();
                });

            }

        }

    });

    const voiceTimes = new Collection();

    client.on(Events.VoiceStateUpdate, async function(oldMember, newMember) {

        const KimoServer = await client.guilds.fetch(kimoServerID);
        const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
        const oldChannel = oldMember.channel;
        const newChannel = newMember.channel;
    
        if (oldChannel !== newChannel) {
            // User moved from one channel to another or joined/left a channel
            if (oldChannel) {
                // User left a voice channel
                const leaveTime = new Date();
                let joinTime = voiceTimes.get(oldMember.id);

                if (!joinTime) {
                    joinTime = new Date().getTime() + (1000 * 60 * 5);
                }

                const timeSpent = leaveTime - joinTime;
                // Update time spent in voice chat
                if (voiceTimes.has(oldMember.id)) {
                    voiceTimes.delete(oldMember.id);
                }
                console.log(`${oldMember.member.displayName} spent ${timeSpent / 1000} seconds in voice chat.`);

                const userId = newMember.member.user.id;

                try {
                    let userVoiceChat = await UserStats.findOne({ userID: userId });

                    if (!userVoiceChat) {
                    // If the user entry doesn't exist, create a new one
                    userVoiceChat = new UserStats({
                        userID: userId,
                        vcTime: timeSpent,
                    });
                    } else {
                    // If the user entry exists, update the total time
                    userVoiceChat.vcTime += timeSpent;
                    }

                    await userVoiceChat.save();
                }
                catch(err) {
                    botLogChannel.send({content: 'FAILED SOMETHING: ERROR IS' + err});
                }

            }

            if (newChannel) {
                console.log ('VC JOIN DETECTED');
                // User joined a voice channel
                const joinTime = new Date();
                // Store the join time
                voiceTimes.set(newMember.id, joinTime);
            }
        }
    });

    // client.on(Events.VoiceStateUpdate, async function(oldMember, newMember) {
    //     console.log ('VC JOIN DETECTED');
    //     console.log (newMember.member.voice);
    //     console.log (newMember.member.voice.channel);
    //     if (!newMember.channel) {
    //         // User left voice channel
    //         const userId = newMember.member.user.id;
    //         const durationInVoiceChat = Date.now() - newMember.member.voice.channel.joinedTimestamp;
            
    //         // Retrieve the user's entry from the database
    //         let userVoiceChat = await UserStats.findOne({ userID: userId });
            
    //         if (!userVoiceChat) {
    //           // If the user entry doesn't exist, create a new one
    //           userVoiceChat = new UserStats({
    //             userID: userId,
    //             vcTime: durationInVoiceChat,
    //           });
    //         } else {
    //           // If the user entry exists, update the total time
    //           userVoiceChat.vcTime += durationInVoiceChat;
    //         }

    //         console.log ('user left vc');
    //         console.log (`VC DURATION ${durationInVoiceChat}`)
        
    //         // Save the updated entry to the database
    //         await userVoiceChat.save();
    //       }
    // });

};
