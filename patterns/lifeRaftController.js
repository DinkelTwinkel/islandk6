const { Events, ChannelType } = require('discord.js');
const messageDeletionTimer = 10;

module.exports = async (client) => {

    client.on(Events.MessageCreate, async (message) => {

        if (message.member.user.bot) return;
        // last channel is clubs.
        if (message.channel.id === '1221767571242487848') {

            // if (attachmentTest(message) != null) {
                // successful image post.
                const thread = await message.startThread({
                    name: limitString(message.content, 99),
                    autoArchiveDuration: 1440,
                    // 24 hours
                    type:  ChannelType.PublicThread,
                    // flags: ThreadFlags.FLAGS.CREATED_FROM_MESSAGE,
                  });
                // create a thread.
            // }
            
        }
        else {
            return;
        }

    });

};

function limitString(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.substring(0, maxLength);
    }
}

function attachmentTest(message) {

        if (containsDiscordInviteLink(message.content)) {
            console.log('Valid Discord InviteLink Found.');
            return message;
        }
        else {
            console.log('No valid image extension found in the attachment URL.');
            deleteMessageAndReply (message);
            return null;
        }
}

function containsDiscordInviteLink(str) {
    const regex = /https:\/\/discord\.gg\/[a-zA-Z0-9]+/;
    return regex.test(str);
}

async function deleteMessageAndReply(message) {
    
    const utcEpochTimestamp = Math.floor(Date.now() / 1000) + messageDeletionTimer;

    const response = await message.reply ({ content: 'Life Bought Be sure your message contains a discord invite Link\n' + `Self deleteing in <t:${utcEpochTimestamp}:R>`, ephemeral: true });
    setTimeout(() => {

        response.delete();
    }, messageDeletionTimer * 1000);

    if (!message.member.roles.cache.get('1202555128352346143')) {
        message.delete();
    }

}