const KimoTracker = require('../models/kimoTracker');
const { ActivityType } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const UserData = require('../models/userData');

module.exports = async (client) => {

    const wage = 15;
    // daily page
    const KimoServer = await client.guilds.fetch(kimoServerID);
    const adminWageChannel = KimoServer.channels.cache.get('1210243632255205406');
    const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);

    botLogChannel.send(`!puppet 1 ${adminWageChannel.id} # It's time for your daily wage. Thanks for the hard work!`)

    const lifeGuardRole = KimoServer.members.cache.filter(member => member.roles.cache.has('1202555128352346143'));

    setTimeout(() => {
        lifeGuardRole.forEach(async guard => {

            const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216'});
            jianDaoWallet.money -= wage

            const result = await UserData.findOne({userID: guard.id})
            result.money += wage;
            await result.save();
            adminWageChannel.send(`${guard} given 15 seashells.`);
            
        });
    }, 1000);

    setTimeout(() => {
        botLogChannel.send(`!puppet 1 ${adminWageChannel.id} **alright. cya tomorrow.**`)
    }, 10000);

};
