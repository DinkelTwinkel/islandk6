const { EmbedBuilder } = require('discord.js');
const { kimoServerID, deadRoleID } = require('../ids.json');
const UserStats = require('../models/userStatistics');
const Jail = require('../models/jailTracker');
const UserData = require('../models/userData');
const statEmbed = require('./statEmbed');

module.exports = async (client, channel) => {

    const inbetweenCannonTime = 1;

    // get all members who are currently dead role.
    //

    const KimoServer = await client.guilds.fetch(kimoServerID);
    await KimoServer.members.fetch();
    const deadRole = KimoServer.roles.cache.get(deadRoleID);
    const deadMembers = await deadRole.members;

    channel.send ({ content: '# HONOURING THE FALLEN' });
    channel.send ({ content: 'https://tenor.com/view/fallen-memorium-hunger-games-salute-gif-16737525' });
    // deadMembers.forEach(async member => {

    //     channel.send ({ embeds: [await createCannonEmbed (member)] });
    //     // console.log (await createCannonEmbed (member));
    // });
    const deadMembersArray = Array.from(deadMembers);
    // console.log(deadMembersArray[0][1]);
    // channel.send ({ embeds: [await createCannonEmbed (await deadMembersArray[0][1])] });

    console.log (deadMembersArray.length)
    for (let index = 0; index < Array.from(deadMembers).length; index++) {

        setTimeout(async () => {
            channel.send ({ content: '# BANG 💥' });
            channel.send ({ content: 'HONOURING THE FALLEN' });
        }, (index + 0.5) * 1000 );

        setTimeout(async () => {
            channel.send ({ embeds: [await createCannonEmbed (deadMembersArray[index][1])] });
        }, (index + 1) * 1000 );
        
    }

    setTimeout(async () => {
        channel.send ({ content: '# HONOUR COMPLETE' });
        channel.send ({ content: 'May the odds ever be in your favour...' });
    }, (Array.from(deadMembers).length + 2) * 1000 );


};

async function createCannonEmbed (member) {

    return await statEmbed(member);

}
