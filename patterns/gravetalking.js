const KimoTracker = require('../models/kimoTracker');
const { ActivityType } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');

module.exports = async (client) => {


const KimoServer = await client.guilds.fetch(kimoServerID);
const graveChannel = KimoServer.channels.cache.get('1218963220878983189');

setInterval(async () => {
    
    graveChannel.messages.fetch({ limit: 50 })
    .then(messages => {
        // Delete all fetched messages
        graveChannel.bulkDelete(messages);
    })
    .catch(console.error);

    graveChannel.send(await getFortuneCookie(client));

}, 1000 * 60 * Math.random());

};

async function getFortuneCookie(client) {

    const backRooms = client.guilds.cache.get('1063167135939039262');
    const cookieChannel = backRooms.channels.cache.get('1203782984268783656');

    const messages = await getAllMessagesInChannel(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage.content;

}