const { Events, EmbedBuilder, InteractionCollector } = require("discord.js");
const getAllMessagesInChannel = require("./getAllMessagesInChannel");
const Fortune = require("../models/dailyFortune");
const UserState = require("../models/userState");
const EdgeKing = require("../models/edgeKing");
const KimoTracker = require("../models/kimoTracker");
const UserData = require("../models/userData");
const UserStats = require("../models/userStatistics");
const PostTime = require("../models/averageposttimes");

module.exports = async (client) => {

    client.on(Events.MessageCreate, async (message) => {

        console.log ('new message detected');

        if (message.member.user.bot) return;

        if (message.channel.id != '1202747652345962496' && message.channel.id != '1193665461699739738') return;

        if (message.member.roles.cache.get('1206976652383625307')) return;

        if (attachmentTest(message) != null) {

            // removing invalid post role if they have it.
            if (message.member.roles.cache.get('1210393789043310672')) {
                message.member.roles.remove ('1210393789043310672');
            }

            const kimoTracker = await KimoTracker.findOne({ serverId: message.guild.id });

            // user statistics total kimo posting tracking

            let userStats = await UserStats.findOne({ userID: message.member.user.id });

            if (!userStats) {
                userStats = new UserStats ({
                    userID: message.member.user.id,
                    totalKimoPost: 0,
                })
            }

            userStats.totalKimoPost += 1;
            await userStats.save();

            // 
            
            console.log ('valid post detected by user: '+ message.author.id );

            let userFortune = await Fortune.findOne ({ userId: message.author.id });
            let result = await UserState.findOne({ userID: message.author.id });

            if (!result) {
                result = new UserState ({
                    userID: message.member.id,
                    currentState: 'DANGER',
                })
            }

            if (result.currentState === 'DEAD') return;

            if (result.postedToday == false) {
                result.postedToday = true;
                await result.save();

                if (userFortune) {
                        userFortune.Fortune = await getFortuneCookie(client);
                        await userFortune.save();
                        
                    
                        postFortune(message, userFortune.Fortune);

                        // AVERAGE POST TIME TRACKER.

                        const utcMiliBeforeCutOff = kimoTracker.nextDate - new Date ().getTime();

                        let postTime = await PostTime.findOne({ userID: message.member.id });
                        if (!postTime) {
                            postTime = new PostTime({
                                userID: message.member.id,
                                averagePostTime: utcMiliBeforeCutOff,
                                totalPostingTime: utcMiliBeforeCutOff,
                                postNumber: 1,
                            })
                            await postTime.save();
                        }
                        else {
                            
                            postTime.totalPostingTime += utcMiliBeforeCutOff;
                            postTime.postNumber += 1;
                            postTime.averagePostTime = postTime.totalPostingTime/postTime.postNumber;
                            await postTime.save();
                            
                        }
                }
                else {

                userFortune = new Fortune ({
                    userId: message.author.id,
                    Fortune: await getFortuneCookie(client),
                    lastFortuneDay: new Date ().getDate(),
                })
                await userFortune.save();

                postFortune(message, userFortune.Fortune);

                }
                
            }

        }


      })

};

async function postFortune(message, fortune) {

    console.log ('havent posted today, creating new daily fortune')
    // reply with daily quote.
    const embed = new EmbedBuilder()
    .setDescription("```" + fortune + "```" )
    .setFooter({
        text: 'Message in a bottle',
        iconURL: "https://cdn.discordapp.com/attachments/1202898933328781332/1203685779675684964/bottle.png?ex=65d1febd&is=65bf89bd&hm=8de19cc72f202eab14caef39692732b394e2c7003822e089f39b402aabe2148f&",
    })
    .setColor("#f9ffcc");

    const response = await message.reply({content: ``, embeds: [embed] })
    setTimeout(() => {
        response.delete();
    }, 30 * 1000);

}

function attachmentTest(message) {
    const imageExtensions = /\.(png|jpeg|jpg|jpg|webp|gif|mp4)/i;

    if (message.attachments.size > 0) {
        const attachment = message.attachments.first(); // Get the first attachment (usually the most recent one)

        // Regular expression to match image file extensions anywhere in the string

        if (imageExtensions.test(attachment.url)) {
            console.log('Valid image attachment found.');
            return attachment.url;
        }
        else {
            console.log('No valid image extension found in the attachment URL.');
            return null;
        }
    }
    else if (message.content.startsWith('https://cdn.discordapp.com/attachments/')) {

        if (imageExtensions.test(message.content)) {
            console.log('Valid image attachment found. Link CDN Edition');
            return message.content;

        }
        else {
            console.log('No valid image extension found in the attachment URL.');
            return null;
        }
    }
    else {
        return null;
    }
}

async function getFortuneCookie(client) {

    const backRooms = client.guilds.cache.get('1063167135939039262');
    const cookieChannel = backRooms.channels.cache.get('1200757419454758953');

    const messages = await getAllMessagesInChannel(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage.content;

  }