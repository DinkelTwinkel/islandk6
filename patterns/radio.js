const KimoTracker = require('../models/kimoTracker');
const { ActivityType, Events } = require('discord.js');

module.exports = async (client) => {


    client.on(Events.MessageCreate, async (message) => {

        if ( message.author.bot ) return;

        const kimoServer = message.guild;

        // Island A

        if (message.channel.id == '1202775859635818508'){

            const islandBChannel = await kimoServer.channels.fetch('1202876970426441768');
            islandBChannel.send('[unknown transmission] ' + message.content);

        }

        // // Island B

        if (message.channel.id == '1202876970426441768'){

            const islandAChannel = await kimoServer.channels.fetch('1202775859635818508');
            islandAChannel.send('[unknown transmission] ' + message.content);

        }

    }
    )



};
