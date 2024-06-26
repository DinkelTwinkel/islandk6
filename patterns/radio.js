const KimoTracker = require('../models/kimoTracker');
const { ActivityType, Events } = require('discord.js');
const cypherSpeak = require('./cypherSpeak');

module.exports = async (client) => {


    client.on(Events.MessageCreate, async (message) => {

        if ( message.author.bot ) return;

        const kimoServer = message.guild;

        if (message.channel.id == '1215040265761460304') {

          kimoServer.channels.cache.get('1202784547822112879').send('```' + `${message.member.displayName}: ${message.content} [SUPER RADIO]` + '```');

        }

        if (message.channel.id == '1202876942714544148') {

          kimoServer.channels.cache.get('1202784547822112879').send('```' + `${message.member.displayName}: ${message.content} [PEACH]` + '```');
          //kimoServer.channels.cache.get('1202622607250296832').send('```' + `${message.member.displayName}: ${message.content} [PEACH PARADISE]` + '```');

        }

        if (message.channel.id == '1202622607250296832') {

          kimoServer.channels.cache.get('1202784547822112879').send('```' + `${message.member.displayName}: ${message.content} [MELON]` + '```');
          //kimoServer.channels.cache.get('1202876942714544148').send('```' + `${message.member.displayName}: ${message.content} [BING ISLAND]` + '```');

        }

        if (message.channel.id == '1202784547822112879') {

          kimoServer.channels.cache.get('1215040265761460304').send('```' + `${message.member.displayName}: ${message.content} [DUNGEON]` + '```');
          kimoServer.channels.cache.get('1202876942714544148').send('```' + `${message.member.displayName}: ${message.content} [DUNGEON]` + '```');
          kimoServer.channels.cache.get('1202622607250296832').send('```' + `${message.member.displayName}: ${message.content} [DUNGEON]` + '```');

        }


        // const radioChannels = ['1202876970426441768','1202775859635818508','1202784547822112879','1214633910802317362', '1215040265761460304'];

        // radioChannels.forEach(channelID => {

        //   if (message.channel.id == channelID) {

        //     radioChannels.forEach(SENDTO => {
        //       if (SENDTO === channelID) return;
        //       relayMessage (kimoServer, SENDTO, message);
        //     });
        //   }
          
        // });

        // // Island A

        // if (message.channel.id == '1202775859635818508'){

        //     relayMessage (kimoServer, '1202876970426441768', message);
        //     relayMessage (kimoServer, '1202784547822112879', message);

        // }

        // // // Island B

        // if (message.channel.id == '1202876970426441768'){

        //     relayMessage (kimoServer, '1202775859635818508', message);
        //     relayMessage (kimoServer, '1202784547822112879', message);

        // }

        // if (message.channel.id == '1202784547822112879'){

        //     relayMessage (kimoServer, '1202876970426441768', message);
        //     relayMessage (kimoServer, '1202775859635818508', message);

        // }

    }
    )

};

async function relayMessage (kimoServer, channelID, message) {

    const targetChannel = await kimoServer.channels.fetch(channelID);
    cypherSpeak(limitStringLength(obfuscateString(message.content), 500), targetChannel, 300, 5)

}

function obfuscateString(input, chance = 0.5) {
    const obfuscated = input.split('').map((char) => {
      // Determine whether to obfuscate the character
      if (/[a-zA-Z]/.test(char) && Math.random() < chance) {
        const random = Math.random();
        if (random < 0.33) {
          // Replace with a similar-looking number (e.g., 'o' -> '0')
          return char.replace(/[oO]/, '0').replace(/[lL]/, '1').replace(/[eE]/, '3');
        } else if (random < 0.66) {
          // Capitalize the letter
          return char.toUpperCase();
        } else if (random < 0.7) {
          // Repeat the letter
          return char + char;
        } else {
            return char;
        }
      }
      return char;
    });
  
    return obfuscated.join('');
  }

  function limitStringLength(inputString, maxLength) {
    if (inputString.length <= maxLength) {
      // If the string is within the limit, return it as is
      return inputString;
    } else {
      // If the string exceeds the limit, truncate it and add a message
      const truncatedString = inputString.substring(0, maxLength);
      return truncatedString + '- transmission limit reached';
    }
  }