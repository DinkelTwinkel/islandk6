const KimoTracker = require('../models/kimoTracker');
const { ActivityType, Events, EmbedBuilder } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID, safeRoleID } = require('../ids.json');
const UserState = require('../models/userState');
const UserData = require('../models/userData');
const jail = require('./jail');
const Jail = require('../models/jailTracker');
const Report = require('../models/reports');


module.exports = async (client) => {

    client.on(Events.MessageReactionAdd, async (reaction, user) => {

        if (reaction.emoji.name != '❌' && reaction.emoji.name != '⭐') return;

        await reaction.message.guild.members.fetch();
    
        // console.log(reaction.message);
        // console.log(reaction.emoji.name);
    
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        // non admin X
        if (reaction.emoji.name === '❌' && reaction.message.channelId === '1193665461699739738') {

            const member = reaction.message.guild.members.cache.get(user.id);
            //scissor squad check
            if (!member.roles.cache.get('1202555128352346143') && !member.roles.cache.get('1214629711871741962')) {
    
            const KimoServer = await client.guilds.fetch(kimoServerID);
            //const messageAuthor = reaction.message.author;

            const result = await Report.findOne({ postID: reaction.message.id, reporterID: member.id });

            const backRooms = client.guilds.cache.get('1063167135939039262');
            const reportChannel = backRooms.channels.cache.get('1216047138522402896');

            if (!result) {
                const report = new Report ({
                    postID: reaction.message.id,
                    reporterID: member.id,
                })
                await report.save();
                
                const countReport = await Report.find({postID: reaction.message.id});
                console.log (countReport);

                if (countReport.length >= 1) {
                    reportChannel.send ({ content: `${reaction.message.attachments.first().url}\n# ${countReport.length} users have reported this post-> ${reaction.message.url} \n Latest report by ${member}`});
                }
            }

            const reporterWallet = await UserData.findOne({userID: member.id});
            reporterWallet.money -= 5;

            const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
            botLogChannel.send(`reportDetected by ${member}.`);
    
            console.log(' X emoji detected by non scissor squad ');

            reaction.remove();

            };
        }
    
        if (reaction.emoji.name === '❌' && reaction.message.channelId === '1193665461699739738') {

            const member = reaction.message.guild.members.cache.get(user.id);
            //scissor squad check
            if (!member.roles.cache.get('1202555128352346143') && !member.roles.cache.get('1214629711871741962')) return;
    
            const KimoServer = await client.guilds.fetch(kimoServerID);
            //const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    
            console.log(' X emoji detected by scissorsquad');
    
            const messageAuthor = reaction.message.author;

            const result = await UserState.findOne({ userID: messageAuthor.id});
            console.log(result);
            result.currentState = "DANGER";
            await result.save();

            console.log(messageAuthor);
            const messageAuthorMember = await reaction.message.guild.members.cache.get(messageAuthor.id); // the GuildMember object for the member who created the message
            messageAuthorMember.roles.add ('1210393789043310672');
            messageAuthorMember.roles.add (dangerRoleID);
            messageAuthorMember.roles.remove (safeRoleID);
            const notificationChannel = KimoServer.channels.cache.get('1210393681698496553');

            console.log(reaction.message);

            const dailyHighlight = new EmbedBuilder()
            .setAuthor({
                name: "INVALID POST ❌",
                url: reaction.message.url,
            })
            .setImage(await reaction.message.attachments.first().url);
           //  embeds: [dailyHighlight],

            // check for reports and award.

            const userReports = await Report.find({postID: reaction.message.id});
            userReports.forEach(async report => {

                const userData = await UserData.findOne ({ userID: report.reporterID});
                userData.money += 10;
                await userData.save();

                const invalidPosterData = await UserData.findOne ({ userID: messageAuthor.id});
                invalidPosterData.money -= 5;
                await invalidPosterData.save();

            });


            await notificationChannel.send({ files: [{ attachment: reaction.message.attachments.first().url }], content: `${messageAuthorMember} Hey an Kimo admin has marked your daily post as Invalid! This is likely because it doesn\'t fit with the guidelines we wrote in **/rules** and **/figure!** However if this is mistake let us know here. ${reaction.message.url}`});
            //await notificationChannel.send({ embeds: [dailyHighlight], content: `${messageAuthorMember} Hey an Kimo admin has marked your daily post as Invalid! This is likely because it doesn\'t fit with the guidelines we wrote in **/rules** and **/figure!** However if this is mistake let us know here. ${reaction.message.url}`});
            reaction.message.delete();
            
        }

        if (reaction.emoji.name === '❌' && reaction.message.channelId != '1193665461699739738') {
            const KimoServer = await client.guilds.fetch(kimoServerID);

            const member = reaction.message.guild.members.cache.get(user.id);
            //scissor squad check
            if (!member.roles.cache.get('1202555128352346143')) return;
    
            // const KimoServer = await client.guilds.fetch(kimoServerID);
            // const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    
            console.log(' X emoji detected by scissorsquad, on text post.');
    
            const messageAuthor = reaction.message.author;

            console.log(messageAuthor);
            const messageAuthorMember = await reaction.message.guild.members.cache.get(messageAuthor.id); // the GuildMember object for the member who created the message

            console.log(reaction.message);

            //await reaction.message.channel.send('```' + `${messageAuthorMember.displayName}: [R E D A C T E D ]` + '```');

            const jailTracker = await Jail.findOne({ userId: messageAuthorMember.id });

            // if (!messageAuthorMember.roles.cache.get('1210274450679922748')) {
            //     const jailTime = jailTracker.numberOfTimesJailed + 5;
            //     jail(client, messageAuthorMember, `FLAGGED MESSAGE: ${reaction.message.content}`, `${member}`, jailTime);
            // }
            // else {
            //     //messageAuthorMember.timeout(10 * 60 * 1000);
            //     messageAuthorMember.roles.add ('1210393789043310672');
            //     const notificationChannel = KimoServer.channels.cache.get('1210393681698496553');
            //     await notificationChannel.send({content: `${messageAuthorMember} Hey an Kimo admin has flagged your message: ${reaction.message.content} because it does not follow our guidelines in /rules. If you think this was a mistake feel free to let us know here.`});
            // }

            //messageAuthorMember.timeout(10 * 60 * 1000);
            messageAuthorMember.roles.add ('1210393789043310672');
            const notificationChannel = KimoServer.channels.cache.get('1210393681698496553');
            await notificationChannel.send({content: `${messageAuthorMember} Hey your message has been flagged:` + '```' + reaction.message.content + '```' + `because it does not follow our guidelines in /rules, If you think this was a mistake feel free to let us know here.`});

            const adminWallet = await UserData.findOne({ userID: member.id });
            adminWallet.money += 1;
            await adminWallet.save();

            reaction.message.delete();
            
        }


        if (reaction.emoji.name === '⭐') {

            const member = reaction.message.guild.members.cache.get(user.id);
            //scissor squad check
            if (!member.roles.cache.get('1203377553763475497')) return;
    
            const KimoServer = await client.guilds.fetch(kimoServerID);
            //const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    
            console.log('⭐ emoji detected by quest NPC');
    
            const messageAuthor = reaction.message.author;
            console.log(messageAuthor);
            const messageAuthorMember = await reaction.message.guild.members.cache.get(messageAuthor.id); // the GuildMember object for the member who created the message

            const questNPCData = await UserData.findOne({ userID: member.id });

            let userData = await UserData.findOne({ userID: messageAuthorMember.id });
            
            if (!userData) {
                userData = new UserData ({
                    userID: messageAuthorMember.id,
                })
            }

            userData.money += questNPCData.emojiReactAwardAmount;

            await userData.save();

            const adminWallet = await UserData.findOne({ userID: member.id });
            adminWallet.money += 1;
            await adminWallet.save();

            const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
            jianDaoWallet.money -= 1 + questNPCData.emojiReactAwardAmount;
            await jianDaoWallet.save();

            const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
            botLogChannel.send (`⭐React Award Detected by ${member}, ${messageAuthorMember} has been awarded ${questNPCData.emojiReactAwardAmount} shells ${reaction.message.url}`);

        }

        if (reaction.emoji.name === '✂') {

            const member = reaction.message.guild.members.cache.get(user.id);
            //scissor squad check
            if (!member.roles.cache.get('1203377553763475497')) return;
    
            const KimoServer = await client.guilds.fetch(kimoServerID);
            //const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    
            console.log('⭐ emoji detected by quest NPC');
    
            const messageAuthor = reaction.message.author;
            console.log(messageAuthor);
            const messageAuthorMember = await reaction.message.guild.members.cache.get(messageAuthor.id); // the GuildMember object for the member who created the message

            const botLogChannel = KimoServer.channels.cache.get('1221957962474455090');
            botLogChannel.send (`${messageAuthorMember} Hi this is an automated message. We're going to be promoting Scissorchan DTIYS entries on social media. If you'd like to give your consent for us to share the following image, respond with a YES and you social media link. Thank you. ${reaction.message.attachments.first().url}]}`);

        }



    });
    

};
