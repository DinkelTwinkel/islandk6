const Jail = require('../models/jailTracker');
const KimoTracker = require('../models/kimoTracker');
const { ActivityType, EmbedBuilder } = require('discord.js');
const { kimoServerID, announcementChannelID, jailedRoleID, dangerRoleID } = require('../ids.json');

module.exports = async (client, jailTarget, reason, jailer, time) => {

    const roleArray = [];
    jailTarget.roles.cache.forEach(role => {
      roleArray.push(role.id);
    });

    // find current time. convert minutes to utc milliseconds. add to it.
    const now = new Date();
    const jailMilis = time * 60 * 1000;
    const releaseTime = now.getTime() + jailMilis;

    let jailTracker = await Jail.findOne({ userId: jailTarget.user.id});
    if (!jailTracker) {
        jailTracker= new Jail({
            userId: jailTarget.user.id,
            roles: roleArray,
        })
    }

    await jailTracker.save();

    console.log(releaseTime);

    jailTracker.roles = roleArray;
    jailTracker.timeToFree = releaseTime;
    jailTracker.numberOfTimesJailed += 1;
    jailTracker.totalTimeServed += time;
    jailTracker.prename = jailTarget.displayName;

    await jailTracker.save();

    if (jailTarget.roles.cache.get('1210274450679922748')) {
        jailTarget.roles.add(jailedRoleID);
        jailTarget.roles.remove('1202876101005803531');
        jailTarget.roles.remove('1202551817708507136');
    }
    else {
        jailTarget.roles.set([jailedRoleID, dangerRoleID]);
    }

    jailTarget.setNickname(`[PRISONER ${Math.floor(Math.random() * 9000)}]`);


    // set time and set other stats.

    const formattedReleaseTime = Math.floor(releaseTime / 1000);
    const embedDescription = "```" + `REASON : ${reason}` + "```" + `\n jailed by ${jailer}\n release <t:${formattedReleaseTime}:R>`

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `JAIL SENTENCE`,
        })
        .setDescription(embedDescription);

    const kimoServer = await client.guilds.fetch(kimoServerID);
    const announcementChannel = kimoServer.channels.cache.get(announcementChannelID);

    announcementChannel.send({content: `${jailTarget} new arrival! Welcome to the DUNGEON.`, embeds: [embed] });
};
