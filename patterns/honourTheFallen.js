const { EmbedBuilder } = require('discord.js');
const { kimoServerID, deadRoleID } = require('../ids.json');
const UserStats = require('../models/userStatistics');
const Jail = require('../models/jailTracker');
const UserData = require('../models/userData');

module.exports = async (client, channel) => {

    const inbetweenCannonTime = 1;

    // get all members who are currently dead role.
    //

    const KimoServer = await client.guilds.fetch(kimoServerID);
    await KimoServer.members.fetch();
    const deadRole = KimoServer.roles.cache.get(deadRoleID);
    const deadMembers = await deadRole.members;

    channel.send ({ content: '# HONOURING THE FALLEN' });
    channel.send ({ content: 'https://tenor.com/view/fallen-memorium-hunger-games-salute-gif-16737525' });
    // deadMembers.forEach(async member => {

    //     channel.send ({ embeds: [await createCannonEmbed (member)] });
    //     // console.log (await createCannonEmbed (member));
    // });
    const deadMembersArray = Array.from(deadMembers);
    // console.log(deadMembersArray[0][1]);
    // channel.send ({ embeds: [await createCannonEmbed (await deadMembersArray[0][1])] });

    console.log (deadMembersArray.length)
    for (let index = 0; index < Array.from(deadMembers).length; index++) {

        setTimeout(async () => {
            channel.send ({ content: '# BANG 💥' });
        }, (index + 0.5) * 1000 );

        setTimeout(async () => {
            channel.send ({ embeds: [await createCannonEmbed (deadMembersArray[index][1])] });
        }, (index + 1) * 1000 );
        
    }

    setTimeout(async () => {
        channel.send ({ content: '# HONOUR COMPLETE' });
        channel.send ({ content: 'May the odds ever be in your favour...' });
    }, (Array.from(deadMembers).length + 2) * 1000 );


};

async function createCannonEmbed (member) {

    const userStat = await UserStats.findOne({ userID: member.user.id });
    let jailTracker = await Jail.findOne({ userId: member.user.id });
    const userData = await UserData.findOne({ userID: member.user.id });

    if (!jailTracker) {
        jailTracker = new Jail ({
            userId: member.user.id,
            roles: ['1202533924040081408'],
        })
    }

    console.log ( jailTracker );

    const cannonEmbed = new EmbedBuilder()
        .setTitle(`HONOUR THE FALLEN: ${member.displayName}`)
        .setDescription(`${userData.money} 🐚 seashells collected\n` + "```" + `LAST MESSAGE:\n${userStat.lastMessageSent}` + "```")
        .addFields(
            {
              name: "Messages Sent",
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
              value: `${userStat.vcTime + 'mins'}`,
              inline: true
            },
            {
              name: "REFs Shared:",
              value: `${userStat.refsShared}`,
              inline: true
            },
            {
              name: "Messaged Bottled:",
              value: `${userStat.messagesBottled}`,
              inline: true
            },
            {
              name: "Jail Time",
              value: `${jailTracker.totalTimeServed}` + 'mins',
              inline: true
            },
          )
        .setThumbnail(member.displayAvatarURL())
        .setFooter({
            text: userData.socialLink,
    });

    return cannonEmbed;

}
