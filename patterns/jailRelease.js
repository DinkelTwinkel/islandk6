const Jail = require('../models/jailTracker');
const KimoTracker = require('../models/kimoTracker');
const { ActivityType, EmbedBuilder } = require('discord.js');

module.exports = async (client, jailTarget) => {


    let jailTracker = await Jail.findOne({ userId: jailTarget.user.id});

    jailTarget.roles.set(jailTracker.roles);
    jailTarget.roles.add('1202633002790948865');


    // set time and set other stats.

    const embed = new EmbedBuilder()
    .setAuthor({
        name: `${jailTarget.displayName} JAIL SUMMARY`,
    })
    .setDescription("```" + `TOTAL TIME SERVED: ${jailTracker.totalTimeServed} mins \n TIMES JAILED: ${jailTracker.numberOfTimesJailed} ` + "```");

    const kimoServer = await client.guilds.fetch('1193663232041304134');
    const announcementChannel = kimoServer.channels.cache.get('1202747652345962496');
    announcementChannel.send({content: `${jailTarget} has been released from jail... for now.`, embeds: [embed] });


};
