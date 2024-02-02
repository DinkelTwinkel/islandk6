const KimoTracker = require('../models/kimoTracker');
const slice = require('./slice');
const sundayRevive = require('./sundayRevive');

module.exports = async (client) => {

    console.log ('not yet time');

    const currentDate = new Date();
    const currentUTCHour = currentDate.getUTCHours();

    const result = await KimoTracker.findOne({ serverId: '1192955466872004669' });
    // console.log (currentDate.getDay());
    
    if (result == null) return;

        // perform twelve o clock check
        if (currentUTCHour >= 12) {

            const KimoServer = await client.guilds.fetch('1192955466872004669');
            const kimoChannel = KimoServer.channels.cache.get('1192955757705052281');
            const botLogChannel = KimoServer.channels.cache.get('1192963290096218142');


            if (result.nextDate == 1 && currentDate.getDate() != 1 ) {
                return;
            }

            // paste twelve o clock find next date.

                if (currentDate.getDate() >= result.nextDate) {

                const millisecondsInDay = 24 * 60 * 60 * 1000;
                const nextUTCDay = new Date(currentDate.getTime() + millisecondsInDay);
                result.nextDate = nextUTCDay.getDate();

                await result.save();

                if (currentDate.getDay() === 0) {
                    sundayRevive(client);
                    return
                }

                // skip if saturday or revive if sunday.

                botLogChannel.send('NEW DAY, SLICING...');
                kimoChannel.send ('NEW DAY, SLICING...');

                slice(client);

            }
        }

};
