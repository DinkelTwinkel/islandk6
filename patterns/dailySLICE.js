const KimoTracker = require('../models/kimoTracker');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID } = require('../ids.json');
const UserState = require('../models/userState');
const { EmbedBuilder } = require('@discordjs/builders');
module.exports = async (client) => {

    console.log ('not yet time');

    const currentDate = new Date();
    const currentUTCHour = currentDate.getUTCHours();

    const result = await KimoTracker.findOne({ serverId: kimoServerID });
    // console.log (currentDate.getDay());
    
    if (result == null) return;

    if (result.kimoActive === true) {
        console.log('kimo active');
    }
    else {
        console.log ('kimo inactive');
    }

        // perform twelve o clock check
        if (currentUTCHour >= 12) {

            const KimoServer = await client.guilds.fetch(kimoServerID);
            const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);


            if (result.nextDate == 1 && currentDate.getDate() != 1 ) {
                return;
            }

            // paste twelve o clock find next date.

                if (currentDate.getDate() >= result.nextDate) {

                const millisecondsInDay = 24 * 60 * 60 * 1000;
                const nextUTCDay = new Date(currentDate.getTime() + millisecondsInDay);
                result.nextDate = nextUTCDay.getDate();
                result.deadKickedToday = false;

                await result.save();

                // tell scissorchan to slice.
                botLogChannel.send ('!dailyslice');

            }
        }

        // daily dead kick and create summary.
        if (currentUTCHour >= 10 && currentUTCHour < 11 && result.deadKickedToday === false) {

            const KimoServer = await client.guilds.fetch(kimoServerID);
            const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
            const summaryChannel = KimoServer.channels.cache.get('1205107070941134908');

            result.deadKickedToday = true;
            await result.save();
            const members = KimoServer.members.cache.filter(member => member.roles.cache.has(deadRoleID));
            botLogChannel.send(`auto kicking dead.`);
            botLogChannel.send(`creating daily summary.`);

            members.forEach(async member => {
                member.kick();
                botLogChannel.send(`kicking ${member}`);
            })

            // create daily summary.

            const membersWithDangerRole = await UserState.countDocuments({ currentState: 'DANGER' });
            const membersWithSafeRole = await UserState.countDocuments({ currentState: 'SAFE' });
            const membersWithDeadRole = await UserState.countDocuments({ currentState: 'DEAD' });
        
            const totalLiving = membersWithSafeRole + membersWithDangerRole;
            const totalDead = membersWithDeadRole;
        
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "DAILY SUMMARY",
                })
                .setDescription(`ALIVE: ${totalLiving} \n DEAD: ${totalDead}`
                );
        
            summaryChannel.send ({content: '', embeds: [embed] });
            botLogChannel.send ({content: '', embeds: [embed] });
   
        }

};
