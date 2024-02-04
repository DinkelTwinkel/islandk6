const { Events, EmbedBuilder } = require("discord.js");
const getAllMessagesInChannel = require("./getAllMessagesInChannel");
const Fortune = require("../models/dailyFortune");
const UserState = require("../models/userState");
const EdgeKing = require("../models/edgeKing");
const KimoTracker = require("../models/kimoTracker");

module.exports = async (client) => {

    client.on(Events.MessageCreate, async (message) => {

        console.log ('new message detected');

        if (message.member.user.bot) return;

        if (message.channel.id != '1202747652345962496' && message.channel.id != '1193665461699739738') return;

        if (attachmentTest(message) != null) {
            
            console.log ('valid post detected by user: '+ message.author.id );

            let userFortune = await Fortune.findOne ({ userId: message.author.id });
            let result = await UserState.findOne({ userID: message.author.id });

            if (result.currentState === 'DEAD' || result.currentState === 'SAFE') return;

            if (userFortune) {
                if (result.postedToday == false) {

                    userFortune.Fortune = await getFortuneCookie(client);

                    result.postedToday = true;
                    await userFortune.save();
                    await result.save();
                
                    postFortune(message, userFortune.Fortune);
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


            // edge king maker

            const edgeTracker = await EdgeKing.findOne({ KimoServerID: message.guild.id});
            const kimoTracker = await KimoTracker.findOne({ serverId: message.guild.id });

            console.log ('cutoff clock');
        
            const millisecondsInDay = 24 * 60 * 60 * 1000;
        
            const currentDate = new Date();
            const nextUTCDay = new Date(currentDate.getTime() + millisecondsInDay);
            nextUTCDay.setHours(12);
            nextUTCDay.setMinutes(0);
            nextUTCDay.setSeconds(0);
            nextUTCDay.setDate(kimoTracker.nextDate);
        
            const differenceMiliUTC = nextUTCDay.getTime() - currentDate.getTime();
            const differenceSeconds = differenceMiliUTC / 1000;
            const differenceMinutes = differenceSeconds / 60;

            if (edgeTracker.edgeTime > differenceMinutes) {

                // remove crown from all users who possess it.
                // add crown to new user. add user id to database.

                console.log('new edge king crowned');
                message.member.roles.add('1203621959292952636');

                // remove from previous king.
                const oldKing = message.guild.members.cache.get(edgeTracker.currentKingID);

                oldKing.roles.remove('1203621959292952636');
                console.log('removing role from old king');

                edgeTracker.edgeTime = differenceMinutes;
                edgeTracker.previousKingID = edgeTracker.currentKingID;
                edgeTracker.currentKingID = message.author.id;
                edgeTracker.save();

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
        iconURL: "https://cdn.discordapp.com/attachments/1192661895296073780/1203271816496414730/6829994.png?ex=65d07d34&is=65be0834&hm=baddbce47ba413edf025144f2f957175ba5a0e717d635b787e4a3021d9e6fba7&",
    })
    .setColor("#f9ffcc");

    const response = await message.reply({content: ``, embeds: [embed] })
    setTimeout(() => {
        response.delete();
    }, 30 * 1000);

}

function attachmentTest(message) {
    const imageExtensions = /\.(png|jpeg|jpg|jpg|webp|gif)/i;

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