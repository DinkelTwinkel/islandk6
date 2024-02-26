const Jail = require('../models/jailTracker');
const KimoTracker = require('../models/kimoTracker');
const { ActivityType, EmbedBuilder } = require('discord.js');
const { kimoServerID, announcementChannelID, degenerateRoleID } = require('../ids.json');
const UserData = require('../models/userData');

module.exports = async (client, jailTarget) => {

    let jailTracker = await Jail.findOne({ userId: jailTarget.user.id});
    const dataInfo = await UserData.findOne({ userID: jailTarget.user.id });

    if (jailTarget.roles.cache.get('1210274450679922748')) {
        jailTarget.roles.remove('1202749571957006348');
        if (jailTracker.roles.includes('1202876101005803531')) {
            jailTarget.roles.add('1202876101005803531');
        }
        else {
            jailTarget.roles.add('1202551817708507136');
        }
    }
    else {
        await jailTarget.roles.set(jailTracker.roles);
        jailTarget.roles.add(degenerateRoleID);
    }

    jailTarget.setNickname(`${jailTracker.prename}`);

    // set time and set other stats.
    let embedDescription = "```" + `TOTAL TIME SERVED: ${jailTracker.totalTimeServed} mins \n TIMES JAILED: ${jailTracker.numberOfTimesJailed} ` + "```";

    const embed = new EmbedBuilder()
    .setAuthor({
        name: `${jailTarget.displayName} JAIL SUMMARY`,
    })
    .setDescription(embedDescription);

    const kimoServer = await client.guilds.fetch(kimoServerID);
    let announcementChannel = kimoServer.channels.cache.get(announcementChannelID);
    announcementChannel.send({content: `${jailTarget} has been released from jail... for now.`, embeds: [embed] });

    if (dataInfo.group === 0) {
        announcementChannel = kimoServer.channels.cache.get('1202622607250296832');
        await announcementChannel.send(`${jailTarget} has been released from prison.`);
    }
    else {
        announcementChannel = kimoServer.channels.cache.get('1202876942714544148');
        await announcementChannel.send(`${jailTarget} has been released from prison.`);
    }

};
