const KimoTracker = require('../models/kimoTracker');
const { ActivityType } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');

module.exports = async (client) => {

// kick all except Out of System and owner and bots

const KimoServer = await client.guilds.fetch(kimoServerID);
const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
const flushAnnouncementChannel = KimoServer.channels.cache.get('1223604602461487104');

const members = await KimoServer.members.fetch();

botLogChannel.send(`Kick all activated. Kicking everyone except those out of the system.`);

const now = new Date().getTime() + 60000;


flushAnnouncementChannel.send(`FLUSHING @everyone <t:${Math.floor(now/1000)}:R>`);

sendPuppetCommand(0, flushAnnouncementChannel, `This was a triumph`, 0);
sendPuppetCommand(1, flushAnnouncementChannel, `I'm making a note here`, 0.5);
sendPuppetCommand(0, flushAnnouncementChannel, `Huge success`, 1);
sendPuppetCommand(1, flushAnnouncementChannel, `It's hard to overstate my satisfaction`, 1.5);

sendPuppetCommand(1, flushAnnouncementChannel, `Thank you for playing.`, 4);
sendPuppetCommand(0, flushAnnouncementChannel, `Thank you for joining us.`, 5);

sendPuppetCommand(1, flushAnnouncementChannel, `good luck! have a good year! remember to drink water! stop shrimping! stretch your hands!`, 6);
sendPuppetCommand(0, flushAnnouncementChannel, `farewell you fools`, 7);

sendPuppetCommand(1, flushAnnouncementChannel, `https://tenor.com/view/anime-girl-smile-happy-tears-gif-23603422`, 9);
sendPuppetCommand(0, flushAnnouncementChannel, `...`, 12);

sendPuppetCommand(0, flushAnnouncementChannel, `# Kimo Activated`, 29);
sendPuppetCommand(0, flushAnnouncementChannel, `Just kidding :]`, 30);

setTimeout(() => {

    members.forEach(member => {
    
        if (member.user.bot) return;
        if (member.user.id === member.guild.ownerId) return;
        if (member.roles.cache.get('1209326206151819336')) return;
    
        flushAnnouncementChannel.send({ content: `${member} FLUSHED`});
        //member.kick();
        botLogChannel.send(`kicking ${member}`);
    
    });
    
}, 61000);

setInterval(async () => {

    const memberCount = await KimoServer.members.fetch();
    if (memberCount.size < 7) {
        botLogChannel.send(`Kicking complete.`);
        clearInterval();
    }
    
}, 500);

async function sendPuppetCommand (scissorchan, channel, content, delay) {
    setTimeout(() => {
        return botLogChannel.send({content: `!puppet ${scissorchan} ${channel.id} ${content}` ,allowedMentions:{parse:["everyone"]}})
    }, delay * 2000);
}

};


