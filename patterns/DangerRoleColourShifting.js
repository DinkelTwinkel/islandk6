const KimoTracker = require('../models/kimoTracker');
const { ActivityType } = require('discord.js');

module.exports = async (client) => {

// every x amount of time, change danger role colour.
setInterval(async () => {
    const result = await KimoTracker.findOne({ serverId: '1193663232041304134' });

    console.log ('cutoff clock');

    const millisecondsInDay = 24 * 60 * 60 * 1000;

    const currentDate = new Date();
    const nextUTCDay = new Date(currentDate.getTime() + millisecondsInDay);
    nextUTCDay.setHours(12);
    nextUTCDay.setMinutes(0);
    nextUTCDay.setSeconds(0);
    nextUTCDay.setDate(result.nextDate);

    const differenceMiliUTC = result.nextDate - currentDate.getTime();

    console.log (differenceMiliUTC);
    console.log (currentDate.getTime());
    console.log (nextUTCDay);

    const differenceSeconds = differenceMiliUTC / 1000;
    const differenceMinutes = Math.floor( differenceSeconds / 60);

    const colourModifier = differenceMinutes / 1440;

    const roleColour = shiftColor('#e80f00','#ffd65c',colourModifier)

    console.log('current hex: ' + roleColour);

    // find role and change role.

    const kimoServer = await client.guilds.fetch ('1193663232041304134');
    const DangerRole = kimoServer.roles.cache.get('1202533924040081408');

    DangerRole.setColor(roleColour);
    }, 1000 * 60 * 5);

};

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  function rgbToHex(r, g, b) {
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
  }


  function shiftColor(startColor, endColor, decimal) {

        const startRGB = hexToRgb(startColor);
        const endRGB = hexToRgb(endColor);

        const currentRGB = {
            r: startRGB.r + (endRGB.r - startRGB.r) * decimal,
            g: startRGB.g + (endRGB.g - startRGB.g) * decimal,
            b: startRGB.b + (endRGB.b - startRGB.b) * decimal
        };
      return rgbToHex(Math.round(currentRGB.r), Math.round(currentRGB.g), Math.round(currentRGB.b));

    };