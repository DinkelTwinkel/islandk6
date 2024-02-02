const { EmbedBuilder } = require("discord.js");
const UserState = require("../models/userState");

module.exports = async (client) => {

    const KimoServer = await client.guilds.fetch('1192955466872004669');
    const kimoChannel = KimoServer.channels.cache.get('1192955757705052281');
    const botLogChannel = KimoServer.channels.cache.get('1192963290096218142');

    const membersWithDangerRole = await UserState.countDocuments({ currentState: 'DANGER' });
    const membersWithSafeRole = await UserState.countDocuments({ currentState: 'SAFE' });
    const membersWithDeadRole = await UserState.countDocuments({ currentState: 'DEAD' });

    const totalLiving = membersWithSafeRole + membersWithDangerRole;
    const totalDead = membersWithDeadRole;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: "WEEKLY SUMMARY",
        })
        .setDescription(`ALIVE: ${totalLiving} \n DEAD: ${totalDead}`
        );

    kimoChannel.send ({content: 'WEEKEND REACHED ^_^ Slicing paused until monday.', embeds: [embed] });
    botLogChannel.send ({content: 'WEEKEND REACHED ^_^ Slicing paused until monday cut off.', embeds: [embed] });

};
