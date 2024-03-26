const { EmbedBuilder } = require('discord.js');
const UserData = require('../models/userData');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const UserState = require('../models/userState');

module.exports = async (userid, member, client) => {


    const KimoServer = await client.guilds.cache.get(kimoServerID);
    const memberObject = KimoServer.members.cache.get(userid)

    let findPouch = await UserData.findOne({ userID: userid });

      if (!findPouch) {
        
        const embed = new EmbedBuilder ()
        .setDescription('no information available');
        return embed;

      }

    let userState = await UserState.findOne({ userID: userid });
    if (!userState) {
        
      userState = new UserState({
        userID: userid,
        currentState: 'N/A',
      });

    }

    let kimoGrade = 'FFF';

    if (findPouch.kimoScore < -10000) {
      kimoGrade = '💩💩💩'
    }
    if (findPouch.kimoScore < -1000) {
      kimoGrade = 'ITCHY BUM'
    }
    if (findPouch.kimoScore < 0) {
      kimoGrade = 'GG GO NEXT'
    }
    if (findPouch.kimoScore > 1000) {
      kimoGrade = 'EEE'
    }
    if (findPouch.kimoScore > 3000) {
      kimoGrade = 'DDD'
    }
    if (findPouch.kimoScore > 5000) {
      kimoGrade = 'CCC'
    }
    if (findPouch.kimoScore > 7000) {
      kimoGrade = 'BBB'
    }
    if (findPouch.kimoScore > 10000) {
      kimoGrade = 'AAA'
    }
    if (findPouch.kimoScore > 15000) {
      kimoGrade = 'SSS'
    }
    if (findPouch.kimoScore > 20000) {
      kimoGrade = 'SSSSS'
    }
    if (findPouch.kimoScore > 30000) {
      kimoGrade = 'EXXXXXX'
    }


      const mayo = new EmbedBuilder()
        .setTitle(` ${findPouch.name} [GRADE: ${kimoGrade}+]`)
        // .setAuthor({
        //   name: '',
        //   //iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1171981787065487401/ezgif.com-resize_5.gif?ex=655ea818&is=654c3318&hm=375bef5772a6af3381e23e1b635172e16a57eb658cbc54ee9b5387056b9ccd90&",
        //   //url: ``,
        // })
        .setThumbnail(`${findPouch.profilePicture}`)
        //.setDescription()
        // .setTitle(`You have **『 ${findPouch.points} Mayo 』**`)
        .setColor(`${findPouch.profileColour}`)
        .addFields(
          {
            name: '\n',
            value: `▬▬▬▬▬▬▬▬▬▬▬▬▬` + '\n```' + `${findPouch.bio}\n` + '```' + `${findPouch.socialLink}` ,
            inline: true
          },
          {
            name: '❖\n',
            value: '\n',
            inline: true
          },
          {
            name: '\n',
            value: `**『 ${findPouch.money} 🐚 』**\n ▪ ${findPouch.pronouns}\n ${memberObject}\n►${userState.currentState}\n XP: ${findPouch.kimoScore}`,
            inline: true
          },
        )
        .setFooter({
          text: `interests: ${findPouch.interests}`,
        });

    return mayo;


};
