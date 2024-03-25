const KimoTracker = require('../models/kimoTracker');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const UserState = require('../models/userState');
const { EmbedBuilder } = require('@discordjs/builders');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const UserData = require('../models/userData');
const EdgeKing = require('../models/edgeKing');
const honourTheFallen = require('./honourTheFallen');
const forceRecheck = require('./forceRecheck');
const marketFairCreate = require('./marketFairCreate');
const adminWage = require('./adminWage');
const getAllMessagesInChannelLastTwoDays = require('./getAllMessagesInChannelLastTwoDays');
const taxes = require('./taxes');
const kimoScore = require('./kimoScore');
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

    const KimoServer = await client.guilds.fetch(kimoServerID);
    const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    const alarmChannel = KimoServer.channels.cache.get('1209334830345748531');
    const panemChannel = KimoServer.channels.cache.get('1209350690342834276');

    const dangerRole = KimoServer.roles.cache.get(dangerRoleID)

    if (result.alarmOne === false && currentUTCHour >= 4 && currentUTCHour < 12 ) {
        result.alarmOne = true;
        await result.save();
        alarmChannel.send(`8 HOURS LEFT <@&${dangerRole.id}>`);
        honourTheFallen(client, panemChannel);
        console.log ('recheck auto requested');
        forceRecheck(client);
    }

    if (result.alarmTwo === false && currentUTCHour >= 9 && currentUTCHour < 12) {
        result.alarmTwo = true;
        await result.save();
        alarmChannel.send(`3 HOURS LEFT <@&${dangerRole.id}>`);
        console.log ('recheck auto requested');
        forceRecheck(client);
        kimoScore(client);
        // taxes(client);
    }

    if (result.alarmThree === false && currentUTCHour >= 11 && currentUTCHour < 12) {
        result.alarmThree = true;
        await result.save();
        alarmChannel.send(`1 HOURS LEFT <@&${dangerRole.id}>`);
        console.log ('recheck auto requested');
        forceRecheck(client);
    }


        // perform twelve o clock check
        if (currentDate.getTime() >= result.nextDate) {

            // if (result.nextDate == 1 && currentDate.getDate() != 1 ) {
            //     return;
            // }

            // paste twelve o clock find next date.

                if (currentDate.getTime() >= result.nextDate) {

                if (result.slaughter === true) {
                    result.currentPeriodLength = result.currentPeriodLength / 2;
                }
                else {
                    result.currentPeriodLength = 24 * 60 * 60 * 1000;
                }

                const millisecondsInDay = parseInt();
                currentDate.setSeconds(0);
                //const nextUTCDay = new Date();
                result.nextDate = currentDate.getTime() + result.currentPeriodLength;
                result.deadKickedToday = false;
                result.alarmOne = false;
                result.alarmTwo = false;
                result.alarmThree = false;
                const edgeTracker = await EdgeKing.findOne({KimoServerID: kimoServerID});
                edgeTracker.firstPostered = false;

                await edgeTracker.save();
                await result.save();

                botLogChannel.send ('!dailyslice');

                if (result.slaughter === true) {
                    return slaughterMode(client);
                }

                // tell scissorchan to slice.
                // await channelLock (client);
                adminWage(client);
                
                // // dailyHighlight (client);
                // setTimeout(() => {
                //     channelUnLock (client);
                //     const whyAmIDead = KimoServer.channels.cache.get('1205110914215575562');
                //     whyAmIDead.send ({content: `YOU ARE DEAD <@&${deadRoleID}>, ASK US QUESTIONS HERE OR GO TO THE LAST WORDS CHANNEL TO SAY YOUR GOOD BYES. YOU CAN ALSO USE /GIVE TO PASS ON YOUR SEASHELLS TO YOUR LOVED ONES.`});
                // }, 60 * 1000 * 20);

            }
        }

        // daily dead kick and create summary.
        if (currentUTCHour >= 10 && currentUTCHour < 11 && result.deadKickedToday === false) {

            const KimoServer = await client.guilds.fetch(kimoServerID);
            const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
            const summaryChannel = KimoServer.channels.cache.get('1205107070941134908');
            const lastWords = KimoServer.channels.cache.get('1202633424381153300');

            result.deadKickedToday = true;
            await result.save();
            const members = KimoServer.members.cache.filter(member => member.roles.cache.has(deadRoleID));
            botLogChannel.send(`auto kicking dead.`);
            botLogChannel.send(`creating daily summary.`);
            lastWords.send('# Flushing Dead 🚽');

            const membersArray = Array.from(members);

            for (let index = 0; index < membersArray.length; index++) {

                console.log (membersArray[index]);
                
                lastWords.send(`flushing ${membersArray[index][1]}`);
                const wallet = await UserData.findOne({userID: membersArray[index][1].id})
                
                console.log (`DEAD WALLET: ${wallet.money}`);

                botLogChannel.send(`${wallet.money} shells transferred from ${members[index]} to <@1202895682630066216>.`);

                const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
                jianDaoWallet.money += wallet.money;
                await jianDaoWallet.save();
                console.log (`JIAN DAO WALLET: ${jianDaoWallet.money}`);

                botLogChannel.send(`kicking ${members[index]}`);
                membersArray[index][1].kick();
            
            }

            lastWords.send(`# Flush complete.`);

            // members.forEach(async member => {

            // })

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
        
            summaryChannel.send ({content: '\n', embeds: [embed] });
            botLogChannel.send ({content: '\n', embeds: [embed] });
   
        }

};

async function slaughterMode (client) {

    const membersWithDangerRole = await UserState.countDocuments({ currentState: 'DANGER' });
    const membersWithSafeRole = await UserState.countDocuments({ currentState: 'SAFE' });
    const membersWithDeadRole = await UserState.countDocuments({ currentState: 'DEAD' });

    const totalLiving = membersWithSafeRole + membersWithDangerRole;
    const totalDead = membersWithDeadRole;

    const tracker = await KimoTracker.findOne({serverId: kimoServerID});

    const postDailyEmbed = new EmbedBuilder()
        .setAuthor({
            name: "ROUND COMPLETE",
        })
        .setDescription(`ALIVE: ${totalLiving} \n DEAD: ${totalDead}\n NEXT CUTOFF <t:${Math.floor(tracker.nextDate/1000)}:R>`
        );

    const embed = new EmbedBuilder()
        .setTitle("Blood on the Ocean, Blood on the Deck 🩸")
        .setDescription("```Welcome to the secret final level of Kimodameshi 6. Good work surviving so far. Let's end this. [CUT OFF REACTIVATED]```\nSCENARIO CONDITION:\n**After every cutoff, the next cutoff is HALVED**\nDie or survive and die later. Good luck." + `\n\n CUT OFF: <t:${Math.floor(tracker.nextDate/1000)}:R>`)
        //.setColor("#520000")
        .setFooter({
            text: "Scenario Clear Condition: ?????????",
    });

    const KimoServer = await client.guilds.fetch(kimoServerID);
    const postDailyChannel = KimoServer.channels.cache.get('1210228380436398122');
    const trueKimoStoryChannel = KimoServer.channels.cache.get('1209919923241885706'); 

    // check if condition met aka less then 2mins remaining.

    if (totalLiving <= 0) {
        // scenario fail
        tracker.nextDate = new Date().getTime() + (60 * 60 * 1000 * 5000);
        await tracker.save();
        const embed = new EmbedBuilder()
        .setTitle("SCENARIO COMPLETE:")
        .setDescription("```Ending 1:\nEscaping the confines of Kimo Island, the party boat unwittingly harbored a malevolent entity. Chaos ensued as the crew fought for their lives, but their struggles proved futile. In the end, there were no survivors aboard the vessel, leaving it adrift, a grim monument to their doomed voyage.```\nTotal Survivors: 0");
        
        postDailyChannel.send({embeds: [embed]});
        postDailyChannel.send({content: '# Thank you for playing Kimodameshi 6 🌴'});
        trueKimoStoryChannel.send({embeds: [embed]});
        trueKimoStoryChannel.send({content: '# Thank you for playing Kimodameshi 6 🌴'});
        return;
    }

    else if (tracker.currentPeriodLength < 1000 * 60 * 2  && totalLiving < 50) {
        // clear condition met.
        tracker.nextDate = new Date().getTime() + (60 * 60 * 1000 * 5000);
        await tracker.save();
        const embed = new EmbedBuilder()
        .setTitle("SCENARIO COMPLETE:")
        .setDescription("```Ending 2:\nEscaping the confines of Kimo Island, the party boat unwittingly harbored a malevolent entity. Chaos ensued as the crew fought for their lives, but their struggles proved futile. In the end, there were ??? survivors aboard the vessel, where will they go now? Find out next time on Dragon Ba- wait does anyone know how to sail this shi-```" + `\nTotal Survivors: ${totalLiving}`);
      
        postDailyChannel.send({embeds: [embed]});
        postDailyChannel.send({content: '# Thank you for playing Kimodameshi 6 🌴'});
        trueKimoStoryChannel.send({embeds: [embed]});
        trueKimoStoryChannel.send({content: '# Thank you for playing Kimodameshi 6 🌴'});
        return;
    }

    else if (tracker.currentPeriodLength < 1000 * 60 * 30 && totalLiving >= 50) {
        // clear condition met.
        tracker.nextDate = new Date().getTime() + (60 * 60 * 1000 * 5000);
        await tracker.save();
        const embed = new EmbedBuilder()
        .setTitle("SCENARIO COMPLETE:")
        .setDescription("```Ending 3:\nThey lived somehow.```" + `\nTotal Survivors: ${totalLiving}`);

        postDailyChannel.send({embeds: [embed]});
        postDailyChannel.send({content: '# Thank you for playing Kimodameshi 6 🌴'});
        trueKimoStoryChannel.send({embeds: [embed]});
        trueKimoStoryChannel.send({content: '# Thank you for playing Kimodameshi 6 🌴'});
        return;
    }

    const messages = await trueKimoStoryChannel.messages.fetch();
    messages.forEach(message => {
      if (message.content === 'KIMODAMESHI HIDDEN SCENARIO') {
        message.edit({ content: 'KIMODAMESHI HIDDEN SCENARIO', embeds: [embed] });
      }
    });

    return postDailyChannel.send({embeds: [ postDailyEmbed ]});

    // to do code for slaughter slices. No channel locking. Only moving forward.
}

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
        name: "LOADING NEW DAY - eta 20mins",
        iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1206958956275044352/93831206single-gear-cog-animation-1-2_1.gif?ex=65dde71f&is=65cb721f&hm=359511b92e9be2c9d730969f2eac22bf2bba081f97b4f2e6d8cfa2178e23bb05&",
    })
    .setDescription('```' + `${await getFortuneCookie(client)}` + '```');

    const message = await postDailyChannel.send ({content: '', embeds: [dailyquote] });
    //await postDailyChannel.send ({ embeds: [await RandomRefOfTheDayEmbed(client)]});
    //console.log(message);

    await dailyHighlight(client);

    const now = new Date();

    if (now.getDay() >= 5 && now.getDay() != 0) {
        marketFairCreate(client, kimoChannelID);
        marketFairCreate(client, '1207882126154932294');
        marketFairCreate(client, '1209347683676852224');
        marketFairCreate(client, '1202622607250296832');
        marketFairCreate(client, '1202876942714544148');
    }

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

async function dailyHighlight (client) {
    const KimoServer = await client.guilds.fetch(kimoServerID);
    const postDailyChannel = KimoServer.channels.cache.get('1193665461699739738');
    const randomMessage = await findRandomHighlightArt(client, postDailyChannel)

    console.log(randomMessage);
    const messageAuthorData = await UserData.findOne({ userID: randomMessage.author.id });
    
    const dailyHighlight = new EmbedBuilder()
    .setAuthor({
        name: "HIGHLIGHT OF THE DAY ⭐",
        url: randomMessage.url,
    })
    .setImage(await randomMessage.attachments.first().url)
    .setFooter({
        text: "Daily by " + messageAuthorData.socialLink,
    });

    messageAuthorData.money += 5;
    await messageAuthorData.save();

    await postDailyChannel.send ({content: '', embeds: [dailyHighlight] });
    await postDailyChannel.send ({ embeds: [await RandomRefOfTheDayEmbed(client)]});

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
    postDailyChannel.send('** Channel Lock Released 🔓 **');
    postDailyChannel.send('# NEW DAY 🌅');
}


async function getFortuneCookie(client) {

    const backRooms = client.guilds.cache.get('1063167135939039262');
    const cookieChannel = backRooms.channels.cache.get('1200757419454758953');

    const messages = await getAllMessagesInChannelLastTwoDays(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage.content;

  }

  async function findRandomHighlightArt(client, postDailyChannel) {

    const tracker = await KimoTracker.findOne({ serverId: kimoServerID });
    const nextDateUtcMil = tracker.nextDate;
    const period = tracker.currentPeriodLength;
    const previousDateUtcMil = nextDateUtcMil - (period * 2);

    //const now = new Date(); // current time

		// const lastTwelveNoon = new Date();
		// lastTwelveNoon.setHours(12);
		// lastTwelveNoon.setTime(lastTwelveNoon.getTime() - (24 * 60 * 60 * 1000)); // subtract one day

    // const deadlineTracker = await Daily.findOne ({ serverID: kimoServerID });

    console.log('Last cut off was: ' + previousDateUtcMil);

    const messages = await getAllMessagesInChannel(postDailyChannel)
        // Filter the messages by creation date
    let filteredMessages = messages.filter(msg => msg.createdAt.getTime() > previousDateUtcMil && msg.createdAt.getTime() < (nextDateUtcMil-(period * 1)));
    filteredMessages = filteredMessages.filter(msg => !msg.author.bot);
    // console.log('Messages found is ' + filteredMessages.size); // Output the number of filtered messages
    
    //logging to admin reports channel.
    console.log('Woah I found ' + filteredMessages.length + ' kimo channel messages since last deadline\n**[Picking random highlight now.}]**');

    const randomIndex = Math.floor(Math.random() * filteredMessages.length);

    const randomMessage = Array.from(filteredMessages)[randomIndex];
    

    // console.log(randomMessage);
    return randomMessage;

  }

  async function RandomRefOfTheDayEmbed(client) {


    const kimoServer = await client.guilds.fetch('1193663232041304134');
    const refChannel1 = kimoServer.channels.cache.get('1202622867863506945');
    

    const messages = await getAllMessagesInChannel(refChannel1);
    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = Array.from(messages)[randomIndex];

    const attachment = randomMessage.attachments.first();

    console.log (randomMessage.embeds[0].data.description);
    console.log (randomMessage.embeds[0].data.footer.text);

    const text = randomMessage.embeds[0].data.description;
    const numbers = text.match(/\d+/g);
    const numbersString = numbers.join("");

    console.log(numbersString);

    const userData = await UserData.findOne({userID: numbersString});
    userData.money += 1;
    await userData.save();
    console.log (`rewarding ${numbersString} for fish`);

    const source = randomMessage.embeds[0].data.footer.text;
    const index = source.indexOf("SOURCE:") + "SOURCE: ".length;
    const result = source.substring(index);

    console.log (result);

    const highlight = new EmbedBuilder()
        .setAuthor({
            name: "ref of the day 💌",
            url: randomMessage.url,
        })
        .setDescription('```' + "Source:" + `${result}` + '```')
        .setThumbnail(`${attachment.url}`)
        .setFooter({
            text: `Submitted by ${userData.socialLink}`,
        });
    return highlight;

  }
