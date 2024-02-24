const { EmbedBuilder } = require('discord.js');
const UserData = require('../models/userData');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');

module.exports = async (userid, member, client) => {


    const KimoServer = await client.guilds.cache.get(kimoServerID);
    const memberObject = KimoServer.members.cache.get(userid)

    let findPouch = await UserData.findOne({ userID: userid });

      if (!findPouch) {
        
        const embed = new EmbedBuilder ()
        .setDescription('no information available');
        return embed;

      }

      const mayo = new EmbedBuilder()
        .setTitle(` ${findPouch.name}`)
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
            value: `**『 ${findPouch.money} 🐚 』**\n ▪ ${findPouch.pronouns}\n ${memberObject}`,
            inline: true
          },
        )
        .setFooter({
          text: `interests: ${findPouch.interests}`,
        });

    return mayo;


};
