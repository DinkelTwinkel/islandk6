const KimoTracker = require('../models/kimoTracker');
const { ActivityType, EmbedBuilder } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');

module.exports = async (client) => {

    // one command to activate slaughter mode + initial dialogue.

    // activates kimo again and create the slaughter embed.
    
    // delete marked channels and begin scissorchan dialogue.


    const KimoServer = await client.guilds.fetch(kimoServerID);

    const channeltoDelete1 = KimoServer.channels.cache.get('1210075857423564810');
    const channeltoDelete2 = KimoServer.channels.cache.get('1210076698268143626');
    const trueKimoStoryChannel = KimoServer.channels.cache.get('1209919923241885706'); 
    const botLogChannel = KimoServer.channels.cache.get(botLogChannelID); 
    const postDailyChannel = KimoServer.channels.cache.get('1210228380436398122');

    const result = await KimoTracker.findOne({serverId: kimoServerID});
    result.nextDate = new Date().getTime() + (1000 * 60 * 60 * 8);
    result.currentPeriodLength= 1000 * 60 * 60 * 8;
    result.slaughter = true;
    result.kimoActive = true;
    await result.save();

    //botLogChannel.send ('!dailyslice');

    sendPuppetCommand(0, trueKimoStoryChannel, `# HEY @everyone`, 0);
    sendPuppetCommand(0, trueKimoStoryChannel, `did you really think you could escape. `, 1);
    sendPuppetCommand(0, trueKimoStoryChannel, `Sail off into the sunset, a happy ever after?`, 2);
    sendPuppetCommand(1, trueKimoStoryChannel, `WELL YA CAN'T!`, 3);

    sendPuppetCommand(0, trueKimoStoryChannel, `# QUIET`, 4);
    sendPuppetCommand(1, trueKimoStoryChannel, `sorry boss`, 5);

    sendPuppetCommand(0, trueKimoStoryChannel, `Anyways, this is where you die.`, 6);
    sendPuppetCommand(0, trueKimoStoryChannel, `!activate`, 7);
    sendPuppetCommand(0, trueKimoStoryChannel, `# Kimo Activated`, 8);
    sendPuppetCommand(1, trueKimoStoryChannel, `# Kimo Activated`, 8);

    const embed = new EmbedBuilder()
        // .setAuthor({
        //     name: "",
        // })
        .setTitle("Blood on the Ocean, Blood on the Deck 🩸")
        .setDescription("```Welcome to the secret final level of Kimodameshi 6. Good work surviving so far. Let's end this. [CUT OFF REACTIVATED]```\nSCENARIO CONDITION:\n**After every cutoff, the next cutoff is HALVED**\nDie or survive and die later. Good luck." + `\n\n CUT OFF: <t:${Math.floor(result.nextDate/1000)}:R>`)
        .setColor("#520000")
        .setFooter({
            text: "Scenario Clear Condition: ?????????",
    });

    setTimeout(() => {

        trueKimoStoryChannel.send({ content: 'KIMODAMESHI HIDDEN SCENARIO', embeds: [embed] });
        postDailyChannel.send({ content: 'KIMODAMESHI HIDDEN SCENARIO', embeds: [embed] });
        
    }, 2000 * 9);

    async function sendPuppetCommand (scissorchan, channel, content, delay) {
        setTimeout(() => {
            return botLogChannel.send({content: `!puppet ${scissorchan} ${channel.id} ${content}` ,allowedMentions:{parse:["everyone"]}})
        }, delay * 2000);
    }


};


