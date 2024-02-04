const { EmbedBuilder } = require('discord.js');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const Fortune = require('../models/dailyFortune');
const KimoTracker = require('../models/kimoTracker');
const UserState = require('../models/userState');
const UserData = require('../models/userData');
const rulesButtons = require('./rulesButtons');

module.exports = async (client, interaction, customID) => {

    let userFortune = await Fortune.findOne ({ userId: interaction.member.id });

    if (userFortune) {
        // if (userFortune.lastFortuneDay != new Date ().getDate()) {
        //     userFortune.Fortune = await getFortuneCookie(client);
        //     userFortune.lastFortuneDay = new Date ().getDate();
        //     await userFortune.save();
        //   }

        // reuse fortune
    }
    else {
      userFortune = new Fortune ({
        userId: interaction.member.id,
        Fortune: await getFortuneCookie(client),
        lastFortuneDay: new Date ().getDate(),
      })
      await userFortune.save();
    }

    // get Safe Danger Dead Number for users in the same group as user.
    // Find by user Role.

        const currentUser = await UserData.findOne({ userID: interaction.member.user.id }) 
        const allUsersInGroup = await UserData.find({ group: currentUser.group });
        const allUserStates = await UserState.find();

        let safe = 0;
        let danger = 0;
        let dead = 0;

        allUsersInGroup.forEach( async member => {
        // compare users with role to userState: Get all those 

        const result = allUserStates.find(user => user.userID === member.userID )
        if (!result) return;

        if (result.currentState === 'SAFE') {
            safe += 1;
            console.log ('safe found');
        }
        else if (result.currentState === 'DANGER') {
            danger += 1;
            console.log ('danger found');
        }
        else if (result.currentState === 'DEAD'){
            dead += 1;
            console.log ('ddead found');
        }

        })

        const embed = new EmbedBuilder()

        .setTitle("Welcome to KimoDaMeshi 6 🌴")
        .setDescription(`**Daily Cut <t:${await getNextCutoff()}:R>**\n` + "```" + `Current Safe: ${safe}\nCurrent Danger: ${danger}\nCurrent Dead: ${dead}` + "```\nSTART OF KIMO: <t:1709294400:f> \nEND OF KIMO: <t:1711800000:f>")
        .setThumbnail("https://cdn.discordapp.com/attachments/1202898933328781332/1203685779675684964/bottle.png?ex=65d1febd&is=65bf89bd&hm=8de19cc72f202eab14caef39692732b394e2c7003822e089f39b402aabe2148f&")
        .setColor("#ff4000")
        .setFooter({
            text: `${userFortune.Fortune}`,
            iconURL: "https://cdn.discordapp.com/attachments/1202898933328781332/1203685866279800832/bottle.png?ex=65d1fed1&is=65bf89d1&hm=a9fb09e08c20d515f07765d4458b7d46fcbac7cc7d15b8fa8bdb135178e06d46&",
        });

        // if (interaction.isButton()) {
        //     interaction.deferUpdate();
        //     return interaction.message.edit({ embeds: [embed], ephemeral: true, components: [await rulesButtons(customID)] });
        // }

    interaction.reply({ embeds: [embed], ephemeral: true, components: [await rulesButtons(customID)] });

};

async function getFortuneCookie(client) {

    const backRooms = client.guilds.cache.get('1063167135939039262');
    const cookieChannel = backRooms.channels.cache.get('1200757419454758953');

    const messages = await getAllMessagesInChannel(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage.content;

}

async function getNextCutoff() {
    
    const result = await KimoTracker.findOne({ serverId: '1193663232041304134' });

    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const nextUTCDay = new Date(currentDate.getTime() + millisecondsInDay);
    nextUTCDay.setHours(12);
    nextUTCDay.setMinutes(0);
    nextUTCDay.setSeconds(0);
    nextUTCDay.setDate(result.nextDate);
    return Math.floor ( nextUTCDay.getTime() / 1000 );
}
  