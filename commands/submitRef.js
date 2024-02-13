const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('shareref')
    .setDescription('submit a ref for the ref channels!')
    .addStringOption(option =>
        option
            .setName('credit')
            .setDescription('source of ref')
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName('imagelink')
            .setDescription('cdn link only!')
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName('description')
            .setDescription('describe the ref (optional)')
            .setRequired(false)),

    async execute(interaction, client) {

        // reward 1 shell per submission.

        // Check for valid Link.
        
        const link = interaction.options.getString('imagelink');

        if (link.startsWith('https://cdn.discordapp.com/attachments/')) {

          const imageExtensions = /\.(png|jpeg|jpg|jpg|webp|gif)/i;
          if (imageExtensions.test(link)) {

            // send ref into ref channels.
            kimoServer = await client.guilds.fetch('1193663232041304134');

            const refChannel1 = kimoServer.channels.cache.get('1202622867863506945');
            const refChannel2 = kimoServer.channels.cache.get('1202877025032081438');
            

            let description = '';

            if (interaction.options.getString('description')) {
                description = "```" + interaction.options.getString('description') + "```"
            }

            const embed = new EmbedBuilder()
            .setDescription(`submitted by: ${interaction.member}\n ` + description + ``)
            .setColor(generateRandomHexColor())
            .setFooter({
                text: `SOURCE: ${interaction.options.getString('credit')}`,
              });

            refChannel1.send({ embeds: [embed], files: [{ attachment: link }]});
            refChannel2.send({ embeds: [embed], files: [{ attachment: link }]});

            interaction.reply({ content: 'Submission Successful! You gained 1 shell!', ephemeral: true })

            const target = interaction.member;
            const targetResult = await UserData.findOne({ userID: target.id });
    
            targetResult.money += 1;
            await targetResult.save();

            const guidelineEmbed = new EmbedBuilder()
            .setDescription("use **/shareref** to add images to this channel.\nCredit the creator directly: do not use repost links such as from pinterest. Thank you!");

            const messages = await refChannel1.messages.fetch();
            messages.forEach(message => {
              if (message.content === '**REF BOOK GUIDELINES**') {
                message.delete();
              }
            });

            const messages2 = await refChannel2.messages.fetch();
            messages2.forEach(message => {
              if (message.content === '**REF BOOK GUIDELINES**') {
                message.delete();
              }
            });

            refChannel1.send({ content: '**REF BOOK GUIDELINES**', embeds: [guidelineEmbed]});
            refChannel2.send({ content: '**REF BOOK GUIDELINES**', embeds: [guidelineEmbed]});
            

          }

        }
        else {

          return interaction.reply({ content: 'invalid link! must be CDN image!', ephemeral: true })
        }


    },
  };

  function generateRandomHexColor() {
    // Generate a random number and convert it to a hexadecimal string
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    
    // Pad the string with zeros to ensure it is always 6 digits long
    const hexColor = "#" + "0".repeat(6 - randomColor.length) + randomColor;
    
    return hexColor;
  }

