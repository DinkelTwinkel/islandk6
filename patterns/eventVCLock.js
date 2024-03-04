const { Events, Collection } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID } = require('../ids.json');
const UserStats = require('../models/userStatistics');
const Fire = require('../models/activeFires');
const ReactionLimit = require('../models/reactionRewardTracker');
const UserData = require('../models/userData');

module.exports = async (client) => {

    const KimoServer = await client.guilds.fetch(kimoServerID);
    const eventChannel = KimoServer.channels.cache.get('1203390855722041354');

    const currentMembersCheck = await eventChannel.members;
    let hostCurrentInChannel = false;
    
    if (currentMembersCheck) {

        await currentMembersCheck.forEach(member => {
            if (member.roles.cache.get('1203384520976502824')) {
                hostCurrentInChannel = true;
            }
        });

    }

    try {

    client.on(Events.VoiceStateUpdate, async function(oldMember, newMember) {


        // const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    
        const PartARole = KimoServer.roles.cache.get('1202551817708507136');
        const PartBRole = KimoServer.roles.cache.get('1202876101005803531');
        
        //console.log (newMember);

        if (newMember.channelId === '1203390855722041354') {
            console.log ('EventChanneLjoinDetected');

            const member = newMember.guild.members.cache.get(newMember.id);

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

        const member = newMember.guild.members.cache.get(newMember.id);

        if (newMember.channelId === null && oldMember.channelId === '1203390855722041354' && member.roles.cache.get('1203384520976502824')) {
            
            // user left event vc
            // get channel, check all current members inside channel. if no event host exists, lock channel. Send message to say it.

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
                    joinTime = new Date().getTime() - ((1000 * 60 * 10) + 1);
                }

                const timeSpent = leaveTime - joinTime;
                // Update time spent in voice chat
                if (voiceTimes.has(oldMember.id)) {
                    voiceTimes.delete(oldMember.id);
                }
                console.log(`${oldMember.member.displayName} spent ${timeSpent / 1000} seconds in voice chat.`);

                // check if VC channel is a fire.
                // reward creator of fire 1 shell per 10 mins spent. to a max of 5 shells per user per fire.

                const findFire = await Fire.findOne({channelId: oldChannel.id});
    
                if (findFire) {
                    const rewardLimitTracker = await ReactionLimit.findOne ({ messageId: findFire.channelId, reactorId: oldMember.id });

                    if (!rewardLimitTracker && oldMember.id != findFire.ownerId) {
                        // check if time spent is greater then 10mins

                        // check if already rewarded for this fire 
                        // self cancels reward if this user has already visited this particular fire.

                        if (timeSpent > 1000 * 60 * 10) {

                            let gain = Math.floor(timeSpent/( 1000 * 60 * 10 ));

                            if (gain > 20) {
                                gain = 20;
                            }

                            const shellRoll = Math.ceil(Math.random() * gain);

                            const member = KimoServer.members.cache.get(newMember.id);

                            botLogChannel.send (`<@${findFire.ownerId}> It seems like ${member.displayName} enjoyed the warmth of your fire today. **You gained ${shellRoll} shells.**`);

                            let creatorWallet = await UserData.findOne({ userID: findFire.ownerId });
                            if (!creatorWallet) {
                                creatorWallet = new UserData ({ userID: oldMember.id });
                            }

                            creatorWallet.money += shellRoll;

                            const newLimitTracker = new ReactionLimit({
                                messageId: findFire.channelId,
                                reactorId: oldMember.id,
                            })

                            await creatorWallet.save();
                            await newLimitTracker.save();

                        }
                    }
                }

                // reward for vcing with new member for the first time.
                // get all members currently still in vc. AND upon user leave. Tell that user who they met and reward both etc.

                //

                const leftChannel = await oldMember.guild.channels.cache.get(oldChannel.id);
                const currentMembers = await leftChannel.members;
                
                if (currentMembers && currentMembers.size <= 10) {
    
                    await currentMembers.forEach(async member => {

                        if (member.user.bot) return;


                        const result1 = await ReactionLimit.findOne ({ messageId: member.id, reactorId: oldMember.id });
                        const result2 = await ReactionLimit.findOne ({ messageId: oldMember.id, reactorId: member.id });

                        if (!result1 && !result2) {

                            let joinTimeRemainer = voiceTimes.get(member.id);

                            if (!joinTimeRemainer) {
                                joinTimeRemainer = new Date().getTime() - ((1000 * 60 * 10));
                            }

                            let timeSpentOfRemainer = leaveTime - joinTimeRemainer;

                            if (timeSpent < timeSpentOfRemainer) {
                                timeSpentOfRemainer = timeSpent;
                            }

                            if (timeSpentOfRemainer > 1000 * 60 * 20) {

                            

                                console.log


                                let newMeetReward = Math.ceil(timeSpentOfRemainer/( 1000 * 60 * 20 ));
                                
                                if (newMeetReward > 20) {
                                    newMeetReward = 20;
                                }

                                let newMeetGain = Math.ceil(Math.random() * newMeetReward);

                                const memberLeave = KimoServer.members.cache.get(newMember.id);

                                botLogChannel.send (`It seems like ${memberLeave} & ${member} met for the first time. **They found ${newMeetGain} shells together.**`);

                                const gainSplit = Math.ceil(newMeetGain/2);

                                let walletLeaver = await UserData.findOne({ userID: memberLeave.id });
                                if (!walletLeaver) {
                                    walletLeaver = new UserData ({ userID: memberLeave.id });
                                }
                                walletLeaver.money += gainSplit;

                                let walletRemainer = await UserData.findOne({ userID: member.id });
                                if (!walletRemainer) {
                                    walletLeaver = new UserData ({ userID: member.id });
                                }
                                walletRemainer.money += gainSplit;

                                const newLimitTracker = new ReactionLimit({
                                    messageId: member.id,
                                    reactorId: oldMember.id,
                                })

                                await walletLeaver.save();
                                await walletRemainer.save();
                                await newLimitTracker.save();

                                // get the vc times of both users. 
                                // use the shorter one.
                                // check if either user can be found in the database.
                                // if not then reward both and post in chat.
                                // split the gain in 2.
                            }
                        }
                    });
    
                }

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
    }
    catch (err) {
        console.log(err);
    }
};
