const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const UserStats = require('../models/userStatistics');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('shareref')
    .setDescription('submit a ref for the ref channels!')
    .addStringOption(option =>
        option
            .setName('credit')
            .setDescription('source of ref')
            .setRequired(true))
    .addAttachmentOption(option =>
      option
          .setName('reference')
          .setDescription('the reference you wish to add')
          .setRequired(true))      
    .addStringOption(option =>
        option
            .setName('description')
            .setDescription('describe the ref (optional)')
            .setRequired(false)),

    async execute(interaction, client) {

        // reward 1 shell per submission.

        // Check for valid Link.

        await interaction.deferReply({ ephemeral: true });
        
        const { options } = interaction;
        const avatar = options.getAttachment('reference');
          if (avatar.contentType.startsWith('image/')) {


            interaction.editReply({ content: 'Submission Successful! You gained 3 shells!', ephemeral: true })

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


            await refChannel1.send({ embeds: [embed], files: [{ attachment: avatar.url }]});
            await refChannel2.send({ embeds: [embed], files: [{ attachment: avatar.url }]});

            const target = interaction.member;
            const targetResult = await UserData.findOne({ userID: target.id });
    
            targetResult.money += 3;
            await targetResult.save();

            const guidelineEmbed = new EmbedBuilder()
            .setDescription("use **/shareref** to add images to this channel.\n Artistic nudity is allowed. \nAvoid pornographic nudity and obscenity. \nSamples are okay to post, but avoid fully posting the contents of paid packs. \n ```Credit the creator directly: do not use repost links such as from pinterest. Thank you!```");

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
            
            // user statistics total ref submission

            const userStats = await UserStats.findOne({ userID: interaction.member.user.id });
            userStats.refsShared += 1;
            await userStats.save();

            // 

        }
        else {

          return interaction.editReply({ content: 'invalid link! an image!', ephemeral: true })
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

