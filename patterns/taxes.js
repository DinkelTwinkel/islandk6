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
            const watchingArray = ['𝗦𝗨𝗡𝗡𝗬 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 🌄', '𝗟𝗜𝗚𝗛𝗧 𝗗𝗥𝗜𝗭𝗭𝗟𝗘💦', '𝗛𝗜𝗚𝗛 𝗪𝗜𝗡𝗗𝗦💨', '𝗛𝗘𝗔𝗩𝗬 𝗥𝗔𝗜𝗡🌧', '𝗧𝗛𝗨𝗡𝗗𝗘𝗥 𝗦𝗧𝗢𝗥𝗠⛈', '𝗔 𝗖𝗛𝗔𝗡𝗖𝗘 𝗢𝗙 𝗠𝗘𝗔𝗧𝗕𝗔𝗟𝗟🧆', '𝗖𝗟𝗘𝗔𝗥 𝗦𝗞𝗜𝗘𝗦🌅', '𝗛𝗜𝗚𝗛 𝗧𝗜𝗗𝗘🌊', '𝗟𝗜𝗚𝗛𝗧 𝗙𝗢𝗚', '𝗛𝗘𝗔𝗩𝗬 𝗙𝗢𝗚', '𝗦𝗜𝗟𝗘𝗡𝗧 𝗛𝗜𝗟𝗟 𝗙𝗢𝗚', '𝗢𝗩𝗘𝗥𝗖𝗔𝗦𝗧']
    
            let dice = Math.floor(Math.random() * watchingArray.length);

            client.user.setPresence({
            activities: [{ name: `${watchingArray[dice]}`, type: ActivityType.Watching }],
            status: 'dnd',
            });
            client.user.setStatus('online');


            setInterval(() => {

                dice = Math.floor(Math.random() * watchingArray.length);

                client.user.setPresence({
                    activities: [{ name: `${watchingArray[dice]}`, type: ActivityType.Watching }],
                    status: 'dnd',
                    });
                    client.user.setStatus('online');

            }, 1000 * 60 * 60 * Math.random());

};
