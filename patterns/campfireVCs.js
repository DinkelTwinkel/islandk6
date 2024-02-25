const KimoTracker = require('../models/kimoTracker');
const { Events, ChannelType } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const Fire = require('../models/activeFires');

module.exports = async (client) => {

    const KimoServer = await client.guilds.fetch(kimoServerID);

    // check any left over fires in case of bot crash.

    const allActiveFires = await Fire.find({});
    if (allActiveFires) {
        allActiveFires.forEach(async fire => {
            let voiceChannel = await KimoServer.channels.fetch(fire.channelId, { force: true });
            checkVCEmpty(voiceChannel)
        });
    }

    setInterval(async () => {
        const allActiveFires = await Fire.find({});
        if (allActiveFires) {
            allActiveFires.forEach(async fire => {
                let voiceChannel = await KimoServer.channels.fetch(fire.channelId, { force: true });
                checkVCEmpty(voiceChannel)
            });
        }
    }, 60 * 1000 * 0.5);

// upon user join to x vc channel
// create new vc channel and move user there.
// every 5 seconds, scan  the vc channels stored and if they don't exist then remove them from the database and if they exist then check if there are more then 1 user inside of it.
// upon user leave also perform vc usercount check. If count is 0, delete channel and delete it on the database.

// upon voice state update check if channel is one of the ones on the data base and if yes.

    client.on(Events.VoiceStateUpdate, async function(oldMember, newMember) {

        if ((newMember.channelId === '1202877516679876648' || newMember.channelId === '1211107198998937711' )) {

            const createVCChannel = KimoServer.channels.cache.get(newMember.channelId);
            const parentCategory = KimoServer.channels.cache.get(createVCChannel.parentId);
            console.log ('join campfire detected');
            console.log (createVCChannel);
            // create new channel in same category 

            const buildFire = await KimoServer.channels.create({
                name: '🎇spark',
                type: ChannelType.GuildVoice,
                parent: parentCategory,
            });

            newMember.setChannel(buildFire);

            buildFire.send (`<@${newMember.id}> Hi Welcome to your fire! You can change the limit of your fire with **/vclimit** and the name with **/vcname!**`);

            // create database entry of VC chat.

            const newFire = new Fire({
                channelId: buildFire.id,
                ownerId: newMember.id,
            });

            await newFire.save();
        }

        // if channelid = any of the ones on the database then do a check vc empty.

        const allActiveFires = await Fire.find({});

        allActiveFires.forEach(async fire => {

            if (newMember.channelId === null) {
                // left a vc.
                // look for vc id on database
                const result = await Fire.findOne({channelId: oldMember.channelId});
                if (result) {
                    let voiceChannel = await KimoServer.channels.fetch(oldMember.channelId, { force: true });
                    checkVCEmpty(voiceChannel)
                }
            }
            
            if (newMember.channelId === fire.channelId) {
                const result = await Fire.findOne({channelId: newMember.channelId});
                if (result) {
                    let voiceChannel = await KimoServer.channels.fetch(newMember.channelId, { force: true });
                    checkVCEmpty(voiceChannel);
                }
            }

            if (oldMember.channelId === fire.channelId) {
                const result = await Fire.findOne({channelId: newMember.channelId});
                if (result) {
                    let voiceChannel = await KimoServer.channels.fetch(oldMember.channelId, { force: true });
                    checkVCEmpty(voiceChannel);
                }
            }

        });

    });

};

async function checkVCEmpty(channel) {
    // console.log(channel);
    console.log ('checking VC current Size');
    console.log (channel.members?.size);

    if (channel.members?.size === 0) {
        channel.delete();
        const result = await Fire.deleteMany({channelId: channel.id});
    }

    const result = await Fire.findOne({channelId: channel.id});

    if (result && result.defaultNaming === true) {
        
        if (channel.members?.size <= 2) {
            channel.setName('🔥 kindling');
            console.log('🔥 kindling');
        }
        else if (channel.members?.size <= 5) {
            channel.setName('🔥 ember');
            console.log('🔥 ember');
        }
        else if (channel.members?.size <= 10) {
            channel.setName('🔥 CAMPFIRE ');
            console.log('🔥 CAMPFIRE ');
        }
        else if (channel.members?.size <= 20) {
            channel.setName('🔥 BONFIRE 🔥');
            console.log('🔥 BONFIRE 🔥');
        }
        else if (channel.members?.size <= 30) {
            channel.setName('🔥👿 𝗛𝗘𝗟𝗟 𝗙𝗜𝗥𝗘 👿🔥');
            console.log('🔥👿 𝗛𝗘𝗟𝗟 𝗙𝗜𝗥𝗘 👿🔥');
        }
        else if (channel.members?.size >= 35) {
            channel.setName('⁉⁉⁉⁉⁉⁉FIRE⁉⁉⁉⁉⁉⁉');
            console.log('⁉⁉⁉⁉⁉⁉FIRE⁉⁉⁉⁉⁉⁉');
        }
    }

}