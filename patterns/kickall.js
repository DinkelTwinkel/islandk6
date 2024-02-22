const KimoTracker = require('../models/kimoTracker');
const { ActivityType } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');

module.exports = async (client) => {

// kick all except Out of System and owner and bots

const KimoServer = await client.guilds.fetch(kimoServerID);
const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);

const members = await KimoServer.members.fetch();

botLogChannel.send(`Kick all activated. Kicking everyone except those out of the system.`);

members.forEach(member => {
    
    if (member.user.bot) return;
    if (member.user.id === member.guild.ownerId) return;
    if (member.roles.cache.get('1209326206151819336')) return;
    member.kick();

    botLogChannel.send(`kicking ${member}`);

});

setInterval(async () => {

    const memberCount = await KimoServer.members.fetch();
    if (memberCount.size < 6) {
        botLogChannel.send(`Kicking complete.`);
        clearInterval();
    }
    
}, 500);

};
