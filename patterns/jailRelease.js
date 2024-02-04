const Jail = require('../models/jailTracker');
const KimoTracker = require('../models/kimoTracker');
const { ActivityType, EmbedBuilder } = require('discord.js');
const { kimoServerID, announcementChannelID, degenerateRoleID } = require('../ids.json');

module.exports = async (client, jailTarget) => {

    let jailTracker = await Jail.findOne({ userId: jailTarget.user.id});

    await jailTarget.roles.set(jailTracker.roles);
    jailTarget.roles.add(degenerateRoleID);


    // set time and set other stats.
    let embedDescription = "```" + `TOTAL TIME SERVED: ${jailTracker.totalTimeServed} mins \n TIMES JAILED: ${jailTracker.numberOfTimesJailed} ` + "```";

    const embed = new EmbedBuilder()
    .setAuthor({
        name: `${jailTarget.displayName} JAIL SUMMARY`,
    })
    .setDescription(embedDescription);

    const kimoServer = await client.guilds.fetch(kimoServerID);
    const announcementChannel = kimoServer.channels.cache.get(announcementChannelID);
    announcementChannel.send({content: `${jailTarget} has been released from jail... for now.`, embeds: [embed] });
};
