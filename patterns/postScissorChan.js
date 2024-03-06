const { Events } = require("discord.js");
const messageDeletionTimer = 5;

module.exports = async (client) => {

    client.on(Events.MessageCreate, async (message) => {

        console.log ('new message detected');

        if (message.member.user.bot) return;

        if (message.channel.id != '1202874614397804605') return;

        if (attachmentTest(message) != null) {
            
            console.log ('valid post detected by user: '+ message.author.id );
            message.react('💌');

        }
        else {
            deleteMessageAndReply(message);
        }

      })

};

function attachmentTest(message) {
    const imageExtensions = /\.(png|jpeg|jpg|jpg|webp|gif|mp4)/i;

    if (message.attachments.size > 0) {
        const attachment = message.attachments.first(); // Get the first attachment (usually the most recent one)

        // Regular expression to match image file extensions anywhere in the string

        if (imageExtensions.test(attachment.url)) {
            console.log('Valid image attachment found.');
            return attachment.url;
        }
        else {
            console.log('No valid image extension found in the attachment URL.');
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
            return null;
        }
    }
    else {
        return null;
    }
}

async function deleteMessageAndReply(message) {
    
    const utcEpochTimestamp = Math.floor(Date.now() / 1000) + messageDeletionTimer;

    const response = await message.reply ({ content: 'Submission failed. Be sure it is uploaded or sent as a `https://cdn.discordapp.com/attachments/` Link\n' + `Self deleteing in <t:${utcEpochTimestamp}:R>`, ephemeral: true });
    setTimeout(() => {

        response.delete();
    }, messageDeletionTimer * 1000);

    await message.delete();

}