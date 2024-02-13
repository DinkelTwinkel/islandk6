const KimoTracker = require('../models/kimoTracker');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID } = require('../ids.json');
const UserState = require('../models/userState');
const { EmbedBuilder } = require('@discordjs/builders');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
module.exports = async (client) => {

    console.log ('not yet time');

    const currentDate = new Date();
    const currentUTCHour = currentDate.getUTCHours();

    const result = await KimoTracker.findOne({ serverId: kimoServerID });
    // console.log (currentDate.getDay());
    
    if (result == null) return;

    if (result.kimoActive === true) {
        console.log('kimo active');
    }
    else {
        console.log ('kimo inactive');
    }

        // perform twelve o clock check
        if (currentUTCHour >= 12) {

            const KimoServer = await client.guilds.fetch(kimoServerID);
            const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);


            if (result.nextDate == 1 && currentDate.getDate() != 1 ) {
                return;
            }

            // paste twelve o clock find next date.

                if (currentDate.getDate() >= result.nextDate) {

                const millisecondsInDay = 24 * 60 * 60 * 1000;
                const nextUTCDay = new Date(currentDate.getTime() + millisecondsInDay);
                result.nextDate = nextUTCDay.getDate();
                result.deadKickedToday = false;

                await result.save();

                // tell scissorchan to slice.
                await channelLock (client);
                botLogChannel.send ('!dailyslice');
                setTimeout(() => {
                    channelUnLock (client);
                }, 60 * 1000 * 0.5);

            }
        }

        // daily dead kick and create summary.
        if (currentUTCHour >= 10 && currentUTCHour < 11 && result.deadKickedToday === false) {

            const KimoServer = await client.guilds.fetch(kimoServerID);
            const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
            const summaryChannel = KimoServer.channels.cache.get('1205107070941134908');

            result.deadKickedToday = true;
            await result.save();
            const members = KimoServer.members.cache.filter(member => member.roles.cache.has(deadRoleID));
            botLogChannel.send(`auto kicking dead.`);
            botLogChannel.send(`creating daily summary.`);

            members.forEach(async member => {
                member.kick();
                botLogChannel.send(`kicking ${member}`);
            })

            // create daily summary.

            const membersWithDangerRole = await UserState.countDocuments({ currentState: 'DANGER' });
            const membersWithSafeRole = await UserState.countDocuments({ currentState: 'SAFE' });
            const membersWithDeadRole = await UserState.countDocuments({ currentState: 'DEAD' });
        
            const totalLiving = membersWithSafeRole + membersWithDangerRole;
            const totalDead = membersWithDeadRole;
        
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "DAILY SUMMARY",
                })
                .setDescription(`ALIVE: ${totalLiving} \n DEAD: ${totalDead}`
                );
        
            summaryChannel.send ({content: '', embeds: [embed] });
            botLogChannel.send ({content: '', embeds: [embed] });
   
        }

};

async function channelLock (client) {
    // lock channel, timeout for 10mins, post quote, unlock.
    const KimoServer = await client.guilds.fetch(kimoServerID);
    const postDailyChannel = KimoServer.channels.cache.get('1193665461699739738');

    const PartARole = KimoServer.roles.cache.get('1202551817708507136');
    const PartBRole = KimoServer.roles.cache.get('1202876101005803531');

    postDailyChannel.permissionOverwrites.edit(PartARole, { SendMessages: false });
    postDailyChannel.permissionOverwrites.edit(PartBRole, { SendMessages: false });
    postDailyChannel.send('** Channel Lock Engaged 🔒**');

    const dailyquote = new EmbedBuilder()
    .setAuthor({
        name: "LOADING NEW DAY",
        iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1206958956275044352/93831206single-gear-cog-animation-1-2_1.gif?ex=65dde71f&is=65cb721f&hm=359511b92e9be2c9d730969f2eac22bf2bba081f97b4f2e6d8cfa2178e23bb05&",
    })
    .setDescription('```' + `${await getFortuneCookie(client)}` + '```');

    postDailyChannel.send ({content: '', embeds: [dailyquote] });

    // setTimeout(async () => {

    //     const membersWithDangerRole = await UserState.countDocuments({ currentState: 'DANGER' });
    //     const membersWithSafeRole = await UserState.countDocuments({ currentState: 'SAFE' });
    //     const membersWithDeadRole = await UserState.countDocuments({ currentState: 'DEAD' });
    
    //     const totalLiving = membersWithSafeRole + membersWithDangerRole;
    //     const totalDead = membersWithDeadRole;
    
    //     const embed = new EmbedBuilder()
    //         .setAuthor({
    //             name: "DAILY SUMMARY",
    //         })
    //         .setDescription(`ALIVE: ${totalLiving} \n DEAD: ${totalDead}`
    //         );
    
    //     postDailyChannel.send ({content: '', embeds: [embed] });
        
    // }, 60 * 1000 * 5);
}

async function channelUnLock (client) {
    // lock channel, timeout for 10mins, post quote, unlock.
    const KimoServer = await client.guilds.fetch(kimoServerID);
    const postDailyChannel = KimoServer.channels.cache.get('1193665461699739738');

    const PartARole = KimoServer.roles.cache.get('1202551817708507136');
    const PartBRole = KimoServer.roles.cache.get('1202876101005803531');

    postDailyChannel.permissionOverwrites.edit(PartARole, { SendMessages: true });
    postDailyChannel.permissionOverwrites.edit(PartBRole, { SendMessages: true });
    postDailyChannel.send('Slicing Complete.');
    postDailyChannel.send('** Channel Lock Released 🔓 **\n # NEW DAY 🌅');
}


async function getFortuneCookie(client) {

    const backRooms = client.guilds.cache.get('1063167135939039262');
    const cookieChannel = backRooms.channels.cache.get('1200757419454758953');

    const messages = await getAllMessagesInChannel(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage.content;

  }