const { Events } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID } = require('../ids.json');
const UserStats = require('../models/userStatistics');
let hostCurrentInChannel = false;

module.exports = async (client) => {

    client.on(Events.VoiceStateUpdate, async function(oldMember, newMember) {

        const KimoServer = await client.guilds.fetch(kimoServerID);
    
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
                    //member.voice.disconnect();
                });

            }

        }

    });

    client.on(Event.VoiceStateUpdate, async (oldState, newState) => {
        if (!newState.channel) {
            // User left voice channel
            const userId = newState.member.user.id;
            const durationInVoiceChat = Date.now() - newState.member.voice.channel.joinedTimestamp;
            
            // Retrieve the user's entry from the database
            let userVoiceChat = await UserStats.findOne({ userID: userId });
            
            if (!userVoiceChat) {
              // If the user entry doesn't exist, create a new one
              userVoiceChat = new UserStats({
                userID: userId,
                vcTime: durationInVoiceChat,
              });
            } else {
              // If the user entry exists, update the total time
              userVoiceChat.vcTime += durationInVoiceChat;
            }
        
            // Save the updated entry to the database
            await userVoiceChat.save();
          }
      });

};
