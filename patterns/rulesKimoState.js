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
      if (userFortune.lastFortuneDay != new Date ().getDate()) {
        userFortune.Fortune = await getFortuneCookie(client);
        userFortune.lastFortuneDay = new Date ().getDate();
        await userFortune.save();
      }
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
        .setThumbnail("https://cdn.discordapp.com/attachments/1192661895296073780/1203270562063843359/911eb1f2cff48f9a4179835007eb7fbd.gif?ex=65d07c09&is=65be0709&hm=3ff00a23a227f508aa1469289530da7a2d5fa07dc8785a100d687ec506d926ca&")
        .setColor("#ff4000")
        .setFooter({
            text: `${userFortune.Fortune}`,
            iconURL: "https://cdn.discordapp.com/attachments/1192661895296073780/1203271816496414730/6829994.png?ex=65d07d34&is=65be0834&hm=baddbce47ba413edf025144f2f957175ba5a0e717d635b787e4a3021d9e6fba7&",
        });

        // if (interaction.isButton()) {
        //     interaction.deferUpdate();
        //     return interaction.message.edit({ embeds: [embed], ephemeral: true, components: [await rulesButtons()] });
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
  