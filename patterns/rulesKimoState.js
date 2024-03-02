const { EmbedBuilder } = require('discord.js');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const Fortune = require('../models/dailyFortune');
const KimoTracker = require('../models/kimoTracker');
const UserState = require('../models/userState');
const UserData = require('../models/userData');
const rulesButtons = require('./rulesButtons');

module.exports = async (client, interaction, customID) => {

  interaction.deferReply({ ephemeral: true });

  console.log (interaction.member.id + ' used Kimo State Command');

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

        if (!currentUser) return interaction.reply({ content: `You can't use this yet`, ephemeral: true });
        const allUsersInGroup = await UserData.find({ group: currentUser.group });

        // const allSafe = await UserState.find({ currentState: 'SAFE' });
        // const allDanger = await UserState.find({ currentState: 'DANGER' });

        // console.log (allSafe);

        // const totalAlive = allSafe.size + allDanger.size;

        const allUserStates = await UserState.find();

        let totalAlive = 0;

        allUserStates.forEach(state => {
            if (state.currentState === 'DANGER' || state.currentState === 'SAFE') {
                totalAlive += 1;
            }
        });

        let safe = 0;
        let danger = 0;
        let dead = 0;

        allUsersInGroup.forEach( async member => {
        // compare users with role to userState: Get all those 

        const result = allUserStates.find(user => user.userID === member.userID )
        if (!result) return;

        if (result.currentState === 'SAFE') {
            safe += 1;
            //console.log ('safe found');
        }
        else if (result.currentState === 'DANGER') {
            danger += 1;
            //console.log ('danger found');
        }
        else if (result.currentState === 'DEAD'){
            dead += 1;
            //console.log ('ddead found');
        }

        })

        const embed = new EmbedBuilder()

        .setTitle("Welcome to KimoDaMeshi 6 🌴")
        .setDescription(`**Daily Cut <t:${await getNextCutoff()}:R>**\n` + "```" + `Current Safe: ${safe}\nCurrent Danger: ${danger}\nCurrent Dead: ${dead}` + "```")
        .addFields(
            {
              name: "\n",
              value: "\nSTART OF KIMO: <t:1709294400:f> \nEND OF KIMO: <t:1711800000:f>",
              inline: true
            },
            {
              name: "\n",
              value: "🌊",
              inline: true
            },
            {
              name: "[???]",
              value: `${totalAlive}`,
              inline: true
            },
          )
        .setThumbnail("https://cdn.discordapp.com/attachments/1154159412160757810/1205160625718951966/fire.gif?ex=65d75c4b&is=65c4e74b&hm=b9632e3a70e9193e98569f36b11188a16a1741cf80034d64fdde4f74d5b73dbf&")
        .setColor("#ff4000")
        .setFooter({
            text: `${userFortune.Fortune}`,
            iconURL: "https://cdn.discordapp.com/attachments/1202898933328781332/1203685779675684964/bottle.png?ex=65d1febd&is=65bf89bd&hm=8de19cc72f202eab14caef39692732b394e2c7003822e089f39b402aabe2148f&",
        });

        // if (interaction.isButton()) {
        //     interaction.deferUpdate();
        //     return interaction.message.edit({ embeds: [embed], ephemeral: true, components: [await rulesButtons(customID)] });
        // }

    interaction.editReply({ embeds: [embed], ephemeral: true, components: [await rulesButtons(customID)] });

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
    return Math.floor ( result.nextDate / 1000 );
}
  