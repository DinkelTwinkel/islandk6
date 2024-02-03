const Jail = require('../models/jailTracker');
const KimoTracker = require('../models/kimoTracker');
const { ActivityType, EmbedBuilder, Events } = require('discord.js');
const jailRelease = require('./jailRelease');
const jail = require('./jail');

module.exports = async (client) => {


    // every 5 s check if jailees need to be released.

    const KimoServer = await client.guilds.fetch('1193663232041304134');
    const botLogChannel = KimoServer.channels.cache.get('1202553664539983882');
    
    setInterval(async () => {

        await KimoServer.members.fetch();
        const members = await KimoServer.members.cache.filter(member => member.roles.cache.has('1202749571957006348'));

        members.forEach(async jailedMember => {
            
            const result = await Jail.findOne({userId: jailedMember.user.id});

            const now = new Date();

            if (now.getTime() > result.timeToFree) {
                jailRelease(client, jailedMember);
            }

        });
        
    }, 1000 * 5);

    client.on(Events.MessageCreate, async (message) => {

        if (message.content.includes("feet")) {


            const roleArray = [];
            message.member.roles.cache.forEach(role => {
              roleArray.push(role.id);
            });
        
            let jailTracker = await Jail.findOne({ userId: message.member.id});
            if (!jailTracker) {
                jailTracker= new Jail({
                    userId: message.member.id,
                    roles: roleArray,
                })
            }

            jailTracker.feetMentionTracker += 1;
        
            await jailTracker.save();

            console.log('feet message detected');

            if (jailTracker.numberOfTimesJailed === 0 )

            jail(client, message.member, 'Spoke about feet', 'auto-sanitary-systems', 10);
            message.reply(`${message.member} has been sent to the dungeon for 10mins for unsanitary behaviour, degenerate role added.`);
            message.member.roles.add('1202633002790948865');

        }

    })

    


};
