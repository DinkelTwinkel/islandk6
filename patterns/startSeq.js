const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Events, EmbedBuilder} = require("discord.js");
const UserData = require('../models/userData');

module.exports = async (client, kimoServer) => {

    // intro channel
    const channel = kimoServer.channels.cache.get('1202878435639304212');

    channel.messages.fetch({ limit: 100 })
    .then(messages => {
        // Delete all fetched messages
        channel.bulkDelete(messages);
    })
    .catch(console.error);

    const embed = new EmbedBuilder()
    .setTitle("UNKNOWN TRANSMISSION")
    .addFields(
        {
        name: "**type /start to get started...**",
        value: "\n",
        inline: false
        },
    );

    channel.send({content: '', embeds: [embed], files: [{ attachment: 'https://cdn.discordapp.com/attachments/1154159412160757810/1205170118628347946/transmission.gif?ex=65d76523&is=65c4f023&hm=b7dc8b8280df6668e238c52cc0c5af754a53daca81125050e13923263fe5ae66&' }]});


    client.on(Events.InteractionCreate, async (interaction) => {

        // starting button sequence

        if ( interaction.customId === 'startyes') {

          const embed = new EmbedBuilder()
          .setTitle("\n")
          .setDescription(`Unknown: "KIMODAMESHI IS A YEARLY FIGURE DRAWING ART EVENT"\n\nUnknown: "EVERY DAY PARTICIPANTS MUST RACE AGAINST TIME TO POST A FIGURE DRAWING OR BE ELIMINATED"`);

          const confirmButton = new ButtonBuilder ()
          .setCustomId('startConfirm')
          .setLabel('HERE, TAKE A LOOK AT THIS')
          .setStyle(ButtonStyle.Secondary);

          const confirmRow = new ActionRowBuilder ()
          .addComponents(confirmButton);

          interaction.reply({ content: '', ephemeral: true, embeds: [embed], components: [confirmRow] });

        }

        if (interaction.customId === 'startConfirm') {

            const final1 = new ButtonBuilder ()
            .setCustomId('startFinal')
            .setLabel('I understand or will read it later')
            .setStyle(ButtonStyle.Secondary);

            const confirmRow = new ActionRowBuilder ()
            .addComponents(final1);

            const embed = new EmbedBuilder()
            .setAuthor({
              name: "🍗 KIMODAMESHI 6 - SURVIVAL GUIDE",
            })
            .setDescription("▪▪▪ ▪▪▪ ▪▪▪\n\n__Submission rules:__\n\nIn the case of submissions containing abstract styles, anthro creatures, and mechs, admins will decide whether they are human enough to pass. \nIf a submission does not pass, it will be invalidated and you will be unsafe until you make a valid post. \n\nPlease make a good faith attempt: there is a clear difference between a short-on-time post and a troll post. Admins may invalidate or kick troll-posters at their discretion. \n\nArtistic nudity is allowed, but kindly avoid pornographic nudity (as well as any obscenity) as this event is not age-gated. *If in doubt, submit your post as a spoiler. *\nYou will be instantly removed and permanently blacklisted if you post sexualized minors or any such offensive material. \n\n▪▪▪ ▪▪▪ ▪▪▪\n\n__Community Rules:__\n\nDo not engage in antisocial behaviour.\nYou may be kicked without warning. \n\nDon't hesitate to report anything suspicious or uncomfortable to an admin. We are here to take care of you. \n▪▪▪ ▪▪▪ ▪▪▪\n▪▪▪ ▪▪▪ ▪▪▪\n```We classify a figure drawing as a depiction of the human body,\n-> this can be a drawing, painting, or sculpt of any level of finish```\nHere is a guide for what we accept as a daily post:\nMinimum time spent is **1 minute**:\nNo upper limit for how much time and effort you want to spend on your post, or how many posts you make.\n\nalso allowed:\n\n- anthropomorphic creatures, \n- body parts,\n- skeletons,\n- mannequins,\n- anatomy-heavy mech/robots\n-compositions where the human(s) are a portion of the piece,\n-updates on previous posts that show progress.\n\nPlease submit in the form of an image or gif. Note that video files will not be accepted. \n\nYou must make at least one (1) post per day. Multiple posts only guarantee your safety for the day in which they are posted.  \nA 'day' occurs once every 24 hours. \nUse the command **/kimo **to check how much time is left until the next day. \n\n\n__FAILING THE CHALLENGE = KICK FROM SERVER__\n\nIf you are unsure of whether something qualifies or not, don't be afraid to message an event organizer. Thank you! - Scissor Squad.\n-----------------------------------------------")
            .setImage("https://media.discordapp.net/attachments/1192955757705052281/1202820284223062036/image.png?ex=65ced8af&is=65bc63af&hm=1242ea044039286208e4d3cc4c3da266b9f7eca6659e1cf3bb6010ca4626d768&=&format=webp&quality=lossless&width=547&height=910")
            .setColor("#f56e00")
            .setFooter({
              text: "Example art by Amreio",
            });
            interaction.reply({ content: '', ephemeral: true, embeds: [embed], components: [confirmRow] });

        }

        if (interaction.customId === 'startno') {

            const final2 = new ButtonBuilder ()
            .setCustomId('startFinal2')
            .setLabel('gotcha')
            .setStyle(ButtonStyle.Secondary);

            const confirmRow = new ActionRowBuilder ()
            .addComponents(final2);

            const embed = new EmbedBuilder()
            .setDescription(`Unknown:  "AT ANY TIME PLEASE USE **/FIGURE** FOR THE LATEST GUIDELINE AND **/HELP** FOR COMMAND INFORMATION."`);

            interaction.reply({ content: '', ephemeral: true, embeds: [embed], components: [confirmRow] });

        }

        if (interaction.customId === 'startFinal' || interaction.customId === 'startFinal2') {

          let result = await UserData.findOne({ userID: interaction.member.user.id })

          let announcementChannel;
          let message;
          let finalRole;

          if (result.group === 0) {
            //group a
            announcementChannel = interaction.guild.channels.cache.get('1202622607250296832');
            finalRole = '1202551817708507136';
          }
          else if (result.group === 1) {
            //group b
            announcementChannel = interaction.guild.channels.cache.get('1202876942714544148');
            finalRole = '1202876101005803531';
          }

          const embed = new EmbedBuilder()
          .setDescription(`Unknown:  "FINE... GOOD LUCK OUT THERE I GUESS **${result.name.toUpperCase()}**"`)
          .addFields(
            {
            name: "**END OF TRANSMISSION**",
            value: "\n",
            inline: false
            },
          );

          message = await announcementChannel.send(`${interaction.member} has arrived.`);
          await interaction.reply({ content: '', embeds: [embed], ephemeral: true })
          interaction.followUp({content: `Click here > ${message.url}`, ephemeral: true});
          interaction.member.roles.set([finalRole]);

        }

      })

};