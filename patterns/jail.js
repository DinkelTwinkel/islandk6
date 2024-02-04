const Jail = require('../models/jailTracker');
const KimoTracker = require('../models/kimoTracker');
const { ActivityType, EmbedBuilder } = require('discord.js');

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

    console.log (releaseTime);

    jailTracker.roles = roleArray;
    jailTracker.timeToFree = releaseTime;
    jailTracker.numberOfTimesJailed += 1;
    jailTracker.totalTimeServed += time;

    await jailTracker.save();

    jailTarget.roles.set(['1202749571957006348', '1202533924040081408']);

    // set time and set other stats.

    const embed = new EmbedBuilder()
    .setAuthor({
        name: `JAIL SENTENCE`,
    })
    .setDescription("```" + `REASON : ${reason}` + "```" + `\n jailed by ${jailer}\n release <t:${Math.floor(releaseTime / 1000)}:R>`);

    const kimoServer = await client.guilds.fetch('1193663232041304134');
    const announcementChannel = kimoServer.channels.cache.get('1202784547822112879');
    announcementChannel.send({content: `${jailTarget} new arrival! Welcome to the DUNGEON.`, embeds: [embed] });


};