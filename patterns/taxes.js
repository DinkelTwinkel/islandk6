const KimoTracker = require('../models/kimoTracker');
const { ActivityType } = require('discord.js');
const UserData = require('../models/userData');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');

module.exports = async (client) => {

    const KimoServer = await client.guilds.fetch(kimoServerID);
    const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);

    const taxBracket1 = 0.005;
    const taxBracket2 = 0.01;
    const taxBracket3 = 0.20;

    const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });


    const allUserData = await UserData.find({});

    allUserData.forEach(async user => {

        const member = KimoServer.members.cache.get(user.userID);
        if (!member) return;
        if (user.userID === '1202895682630066216') return;
        
        if (user.money > 10000) {
            const tax = Math.ceil(user.money * taxBracket3);
            user.money -= tax;
            jianDaoWallet.money += tax;
            botLogChannel.send(`<@${user.userID}> was taxed ${tax} shells`);
        }
        
        else if (user.money > 5000) {
            const tax = Math.ceil(user.money * taxBracket2);
            user.money -= tax;
            jianDaoWallet.money += tax;
            botLogChannel.send(`<@${user.userID}> was taxed ${tax} shells`);
        }

        else if (user.money > 1000) {
            const tax = Math.ceil(user.money * taxBracket1);
            user.money -= tax;
            jianDaoWallet.money += tax;
            botLogChannel.send(`<@${user.userID}> was taxed ${tax} shells`);
        }

        await user.save();
        await jianDaoWallet.save();
        
    });
    

};
