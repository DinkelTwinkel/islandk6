const { EmbedBuilder } = require('discord.js');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const rulesButtons = require('./rulesButtons');

module.exports = async (client, interaction, customID) => {

    const DangerRole = interaction.guild.roles.cache.get('1202533924040081408');
    const SafeRole = interaction.guild.roles.cache.get('1202533882822397972');

    const embed = new EmbedBuilder()
    .setTitle("📚 RULES & BEHAVIOUR GUIDLINES")
    .setDescription(`${DangerRole} If you have this role, you are in danger.\n ${SafeRole} If you have this role, you are safe.\n Being in ${DangerRole} means you haven't posted today and will die at the daily deadline.` + '```Use /kimo to see time left until next daily deadline.```' + "__Submission rules:__\n\nIn the case of submissions containing abstract styles, anthro creatures, and mechs, admins will decide whether they are human enough to pass. \nIf a submission does not pass, it will be invalidated and you will be unsafe until you make a valid post. \n\nPlease make a good faith attempt: there is a clear difference between a short-on-time post and a troll post. Admins may invalidate or kick troll-posters at their discretion. \n\nArtistic nudity is allowed, but kindly avoid pornographic nudity (as well as any obscenity) as this event is not age-gated. *If in doubt, submit your post as a spoiler. *\nYou will be instantly removed and permanently blacklisted if you post sexualized minors or any such offensive material. \n\n▪▪▪ ▪▪▪ ▪▪▪\n\n__Community Rules:__\n\n**Do not behave in such a way that degrades others' enjoyment of this event. Do not knowingly cause distress.**\nYou may be kicked without warning. *\n\n▪▪▪ ▪▪▪ ▪▪▪\n\n __Sharing Ref__\n\n When posting to /shareref, as with daily posts, artistic nudity is allowed. Avoid pornographic nudity and obscenity. \nSamples are okay to post, but avoid fully posting the contents of paid packs. \nCredit the creator directly: do not use repost links such as from pinterest. Thank you!")
    .setColor("#ff4000")
    .setFooter({
      text: "Don't hesitate to report anything suspicious or uncomfortable to an admin. We are here to take care of you.",
    });

    // if (interaction.isButton()) {
    //     interaction.deferUpdate();
    //     return interaction.message.edit({ content: '', embeds: [embed] , ephemeral: true, components: [await rulesButtons(customID)] });
    // }

    interaction.reply({ content: '', embeds: [embed] , ephemeral: true, components: [await rulesButtons(customID)] });

};
