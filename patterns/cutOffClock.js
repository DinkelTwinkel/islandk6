const KimoTracker = require('../models/kimoTracker');
const { ActivityType } = require('discord.js');

module.exports = async (client) => {

    // const result = await KimoTracker.findOne({ serverId: '1192955466872004669' });


    // // Target UTC timestamp in milliseconds (1709294400000 represents a specific date)
    // var targetTimestamp = 1709294400000; // 1st march

    // // Current UTC timestamp in milliseconds
    // var currentTimestamp = Date.now();

    // // Calculate the difference in milliseconds
    // var timeDifference = targetTimestamp - currentTimestamp;

    // // Convert milliseconds to days
    // var daysUntilTarget = Math.floor (timeDifference / (1000 * 60 * 60 * 24));

    // console.log(`There are ${daysUntilTarget} days until the target timestamp.`);

    //     client.user.setPresence({
    //     activities: [{ name: `${daysUntilTarget} days until start.`, type: ActivityType.Watching }],
    //     status: 'dnd',
    //     });

            client.user.setPresence({
            activities: [{ name: `/help`, type: ActivityType.Watching }],
            status: 'dnd',
            });
            client.user.setStatus('idle');

};
