const KimoTracker = require('../models/kimoTracker');
const { ActivityType, Events, EmbedBuilder } = require('discord.js');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID, safeRoleID } = require('../ids.json');
const UserState = require('../models/userState');

module.exports = async (client) => {

    client.on(Events.MessageReactionAdd, async (reaction, user) => {

        if (reaction.message.channelId != '1193665461699739738') return;

        if (reaction.emoji.name != '❌') return;

        await reaction.message.guild.members.fetch();
    
        const member = reaction.message.guild.members.cache.get(user.id);
        //scissor squad check
        if (!member.roles.cache.get('1202555128352346143')) return;
        // console.log(reaction.message);
        // console.log(reaction.emoji.name);
    
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }
    
        if (reaction.emoji.name === '❌') {
    
            const KimoServer = await client.guilds.fetch(kimoServerID);
            //const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    
            console.log(' X emoji detected by scissorsquad');
    
            const messageAuthor = reaction.message.author;

            const result = await UserState.findOne({ userID: messageAuthor.id});
            console.log(result);
            result.currentState = "DANGER";
            await result.save();

            console.log(messageAuthor);
            const messageAuthorMember = await reaction.message.guild.members.cache.get(messageAuthor.id); // the GuildMember object for the member who created the message
            messageAuthorMember.roles.add ('1210393789043310672');
            messageAuthorMember.roles.add (dangerRoleID);
            messageAuthorMember.roles.remove (safeRoleID);
            const notificationChannel = KimoServer.channels.cache.get('1210393681698496553');

            console.log(reaction.message);

            const dailyHighlight = new EmbedBuilder()
            .setAuthor({
                name: "INVALID POST ❌",
                url: reaction.message.url,
            })
            .setImage(await reaction.message.attachments.first().url);
           //  embeds: [dailyHighlight],

            // await notificationChannel.send({ files: [{ attachment: reaction.message.attachments.first().url }], content: `${messageAuthorMember} Hey an Kimo admin has marked your daily post as Invalid! This is likely because it doesn\'t fit with the guidelines we wrote in **/rules** and **/figure!** However if this is mistake let us know here. ${reaction.message.url}`});
            await notificationChannel.send({ embeds: [dailyHighlight], content: `${messageAuthorMember} Hey an Kimo admin has marked your daily post as Invalid! This is likely because it doesn\'t fit with the guidelines we wrote in **/rules** and **/figure!** However if this is mistake let us know here. ${reaction.message.url}`});
            reaction.message.delete();
            
        }
    });
    

};
