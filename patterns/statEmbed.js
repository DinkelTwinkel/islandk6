const KimoTracker = require('../models/kimoTracker');
const { EmbedBuilder } = require('discord.js');
const UserStats = require('../models/userStatistics');
const Jail = require('../models/jailTracker');
const UserData = require('../models/userData');

module.exports = async (member) => {

    let userStat = await UserStats.findOne({ userID: member.user.id });
    let jailTracker = await Jail.findOne({ userId: member.user.id });
    const userData = await UserData.findOne({ userID: member.user.id });

    if (!jailTracker) {
        jailTracker = new Jail ({
            userId: member.user.id,
            roles: ['1202533924040081408'],
            timeToFree: 0,
        })
    }

    if (!userStat) {
      userStat = new UserStats ({
        userID: member.id,
      })
    }

    await userStat.save();

    console.log ( jailTracker );

    const cannonEmbed = new EmbedBuilder()
        .setTitle(`『 ${member.displayName} 』`)
        .setDescription(`${userData.money} 🐚 seashells collected & ${userStat.fishcaught} 🐟 fish caught\n` + "```" + `LAST MESSAGE:\n${userStat.lastMessageSent}` + "```")
        .addFields(
            {
              name: "Messages Yapped",
              value: `${userStat.totalMessages}`,
              inline: true
            },
            {
              name: "Submissions",
              value: `${userStat.totalKimoPost}`,
              inline: true
            },
            {
              name: "VC TIME",
              value: `${Math.floor(userStat.vcTime/1000)}mins`,
              inline: true
            },
            {
              name: "REFs Shared:",
              value: `${userStat.refsShared}`,
              inline: true
            },
            {
              name: "Messages Bottled:",
              value: `${userStat.messagesBottled}`,
              inline: true
            },
            {
              name: "Jail-Time",
              value: `${jailTracker.totalTimeServed}` + 'mins',
              inline: true
            },
          )
        .setThumbnail(member.displayAvatarURL())
        .setFooter({
            text: userData.socialLink,
    });

    return cannonEmbed;

};
