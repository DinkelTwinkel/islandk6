const { Events, ChannelType } = require('discord.js');
const messageDeletionTimer = 10;

module.exports = async (client) => {

    client.on(Events.MessageCreate, async (message) => {

        if (message.member.user.bot) return;

        if (message.channel.id === '1207882126154932294' || message.channel.id === '1209347683676852224') {

            if (attachmentTest(message) != null) {
                // successful image post.
                const thread = await message.startThread({
                    name: message.content,
                    autoArchiveDuration: 1440,
                    // 24 hours
                    type:  ChannelType.PublicThread,
                    // flags: ThreadFlags.FLAGS.CREATED_FROM_MESSAGE,
                  });
                // create a thread.
            }
            
        }
        else {
            return;
        }

    });

};

function attachmentTest(message) {
    const imageExtensions = /\.(png|jpeg|jpg|jpg|webp|gif)/i;

    if (message.attachments.size > 0) {
        const attachment = message.attachments.first(); // Get the first attachment (usually the most recent one)

        // Regular expression to match image file extensions anywhere in the string

        if (imageExtensions.test(attachment.url)) {
            console.log('Valid image attachment found.');
            return attachment.url;
        }
        else {
            console.log('No valid image extension found in the attachment URL.');
            deleteMessageAndReply (message);
            return null;
        }
    }
    else if (message.content.startsWith('https://cdn.discordapp.com/attachments/')) {

        if (imageExtensions.test(message.content)) {
            console.log('Valid image attachment found. Link CDN Edition');
            return message.content;

        }
        else {
            console.log('No valid image extension found in the attachment URL.');
            deleteMessageAndReply (message);
            return null;
        }
    }
    else {
        deleteMessageAndReply (message);
        return null;
    }
}

async function deleteMessageAndReply(message) {
    
    const utcEpochTimestamp = Math.floor(Date.now() / 1000) + messageDeletionTimer;

    const response = await message.reply ({ content: 'Flea Market Submission failed. Be sure it is uploaded or sent as a `https://cdn.discordapp.com/attachments/` Link\n' + `Self deleteing in <t:${utcEpochTimestamp}:R>`, ephemeral: true });
    setTimeout(() => {

        response.delete();
    }, messageDeletionTimer * 1000);

    message.delete();

}