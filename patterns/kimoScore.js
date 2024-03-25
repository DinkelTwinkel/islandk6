const KimoTracker = require('../models/kimoTracker');
const { ActivityType } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const UserData = require('../models/userData');
const UserStats = require('../models/userStatistics');

module.exports = async (client) => {

    const KimoServer = await client.guilds.fetch(kimoServerID);
    const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);

    const members = await KimoServer.members.fetch();

    members.forEach(async member => {

        const userData = await UserData.findOne({userID: member.id });
        const userStats = await UserStats.findOne({userID: member.id });

        const money = userData.money;
        const vcTime = Math.floor(userStats.vcTime/1000/60);
        const messagesSent = userStats.totalMessages;
        
        const totalKimoScore = money + vcTime + messagesSent;

        userData.kimoScore = totalKimoScore;
        await userData.save();
        
    });

};
