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

    channel.send({content: '', embeds: [embed], files: [{ attachment: 'https://cdn.discordapp.com/attachments/1192661895296073780/1202945633124884521/2c3c1102f92f48945d94c599823accaa.gif?ex=65cf4d6c&is=65bcd86c&hm=14f225cbe55407666973b0e3c8e9160a2b81c3fa70e577899c3c2957ecfb41a2&' }]});


    client.on(Events.InteractionCreate, async (interaction) => {

        // starting button sequence

        if ( interaction.customId === 'startyes') {

          const embed = new EmbedBuilder()
          .setTitle("\n")
          .setDescription(`Unknown: "Kimodameshi is a yearly figure drawing art event"\n\nUnknown: "Every day participants must race against time to post a figure drawing or be eliminated"`);

          const confirmButton = new ButtonBuilder ()
          .setCustomId('startConfirm')
          .setLabel('Here, take a look at this')
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
            .setDescription(`**Place holder for Rules**`)
            .setTitle('RULES');

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
            .setDescription(`Unknown:  "At any time please use **/Rules** for the latest guideline and **/Help** for command information."`);

            interaction.reply({ content: '', ephemeral: true, embeds: [embed], components: [confirmRow] });

        }

        if (interaction.customId === 'startFinal' || interaction.customId === 'startFinal2') {

          let result = await UserData.findOne({ userID: interaction.member.user.id })

          if (result.group === 0) {
            //group a

            interaction.member.roles.add('1202551817708507136');
            const announcementChannel = interaction.guild.channels.cache.get('1202622607250296832');
            announcementChannel.send(`${interaction.member} has arrived.`);

          }
          else if (result.group === 1) {
            //group b

            interaction.member.roles.add('1202876101005803531');
            const announcementChannel = interaction.guild.channels.cache.get('1202876942714544148');
            announcementChannel.send(`${interaction.member} has arrived.`);

          }

          const embed = new EmbedBuilder()
          .setDescription(`Unknown:  "okay... good luck out there **${result.name}**"`)
          .addFields(
            {
            name: "**END OF TRANSMISSION**",
            value: "\n",
            inline: false
            },
          );

          interaction.reply({ content: '', embeds: [embed], ephemeral: true })

        }

      })

};