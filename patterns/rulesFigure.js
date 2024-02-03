const { EmbedBuilder } = require('discord.js');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const rulesButtons = require('./rulesButtons');

module.exports = async (client, interaction, customID) => {

    const exampleArtMessage = await getExamplePicture(client);
    const artImage = exampleArtMessage.attachments.first().url;
    const artCredit = exampleArtMessage.content;

    console.log (artImage);
    console.log (artCredit);

    const embed = new EmbedBuilder()
    .setAuthor({
        name: "🍗 KIMODAMESHI 6 - SURVIVAL GUIDE",
    })
    .setTitle("WHAT IS A FIGURE")
    .setDescription("▪▪▪ ▪▪▪ ▪▪▪\n```We classify a figure drawing as a depiction of the human body,\n-> This can be a drawing, painting, or sculpting of any level of finish```\nHere is a guide for what we accept as a daily post:\nMinimum time spent is **1 minute**:\nNo upper limit for how much time and effort you want to spend on your post, or how many posts you make.\n\n**also allowed:**\n\n- anthropomorphic creatures, \n- body parts,\n- skeletons,\n- mannequins,\n- anatomy-heavy mech/robots\n-compositions where the human(s) are a portion of the piece,\n-updates on previous posts that show progress.\n\n```Please submit it in the form of an image or GIF. Note that video files will not be accepted. ```\nYou must make at least one (1) post per day. Multiple posts only guarantee your safety for the day on which they are posted.  \nA 'day' occurs once every 24 hours. \nUse the command **/kimo **to check how much time is left until the next day. \n\nIn the case of abstract styles, anthro, and mechs, these submissions can be judged at admin discretion as to whether they are human enough to pass. \nIf the submission does not pass, it will be invalidated and you will be unsafe until you make a valid post. \n\nPlease make a good-faith attempt: there is a clear difference between a short-on-time post and a troll post. Admins may invalidate or kick troll posters at their discretion. \n\nArtistic nudity is allowed, but kindly avoid pornographic nudity (as well as any obscenity) as this event is not age-gated.  *If in doubt, submit your post as a spoiler.*\n\n__FAILING THE CHALLENGE = KICK FROM SERVER__\n\nIf you are unsure of whether something qualifies or not, don't be afraid to message an event organizer. Thank you! - Scissor Squad.\n-----------------------------------------------")  
    .setImage(artImage)
    .setColor("#f56e00")
    .setFooter({
        text: `example art by ${artCredit}`,
    });

    // if (interaction.isButton()) {
    //     interaction.deferUpdate();
    //     return interaction.message.edit({ content: '', embeds: [embed] , ephemeral: true, components: [await rulesButtons()] });
    // }

    interaction.reply({ content: '', embeds: [embed] , ephemeral: true, components: [await rulesButtons(customID)] });

};

async function getExamplePicture(client) {

    const backRooms = client.guilds.cache.get('1063167135939039262');
    const cookieChannel = backRooms.channels.cache.get('1203262777628561428');

    const messages = await getAllMessagesInChannel(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage;

  }
  