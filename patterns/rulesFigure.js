const { EmbedBuilder } = require('discord.js');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const rulesButtons = require('./rulesButtons');

module.exports = async (client, interaction, customID) => {

    console.log (interaction.member.id + ' used Figure Command');

    await interaction.deferReply({ ephemeral: true});

    const exampleArtMessage = await getExamplePicture(client);
    const artImage = await exampleArtMessage.attachments.first().url;
    const artCredit = exampleArtMessage.content;

    console.log (artImage);
    console.log (artCredit);

    const embed = new EmbedBuilder()
    .setAuthor({
        name: "🍗 KIMODAMESHI 6 - SURVIVAL GUIDE",
    })
    .setTitle("WHAT IS A FIGURE")
    .setDescription("▪▪▪ ▪▪▪ ▪▪▪\n```We classify a figure drawing as a depiction of the human body,\n-> this can be a drawing, painting, or sculpt of any level of finish```\nHere is a guide for what we accept as a daily post:\nMinimum time spent is **1 minute**:\nNo upper limit for how much time and effort you want to spend on your post, or how many posts you make.\n\nalso allowed:\n\n- anthropomorphic creatures, \n- body parts,\n- skeletons,\n- mannequins,\n- anatomy-heavy mech/robots\n-compositions where the human(s) are a portion of the piece,\n-updates on previous posts that show progress.\n\nPlease submit in the form of an image or gif. Note that video files will not be accepted. \n\nYou must make at least one (1) post per day. Multiple posts only guarantee your safety for the day in which they are posted.  \nA 'day' occurs once every 24 hours. \nUse the command **/kimo **to check how much time is left until the next day. \n\n\n__FAILING THE CHALLENGE = KICK FROM SERVER__\n\nIf you are unsure of whether something qualifies or not, don't be afraid to message an event organizer. Thank you! - Scissor Squad.\n-----------------------------------------------")
    .setImage(artImage)
    .setColor("#f56e00")
    .setFooter({
        text: `example art by ${artCredit}`,
    });

    // if (interaction.isButton()) {
    //     interaction.deferUpdate();
    //     return interaction.message.edit({ content: '', embeds: [embed] , ephemeral: true, components: [await rulesButtons(customID)] });
    // }

    await interaction.editReply({ content: '', embeds: [embed] , ephemeral: true, components: [await rulesButtons(customID)] });

};

async function getExamplePicture(client) {

    const backRooms = client.guilds.cache.get('1063167135939039262');
    const cookieChannel = backRooms.channels.cache.get('1203262777628561428');

    const messages = await getAllMessagesInChannel(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage;

  }
  