const { SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js');
const UserData = require('../models/userData');
const kimoIDMaker = require('../patterns/kimoIDMaker');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setid')
    .setDescription('edit your id card')
    .addSubcommand(subcommand =>
      subcommand
        .setName('bio')
        .setDescription(`edit your bio`)
        .addStringOption(option => option.setName('values').setDescription('new bio!').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('interests')
        .setDescription(`edit your interests`)
        .addStringOption(option => option.setName('values').setDescription('new interests').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('picture')
        .setDescription(`profile picture`)
        .addAttachmentOption(option =>
          option
              .setName('avatar')
              .setDescription('the avatar you wish to add.')
              .setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('colour')
        .setDescription(`set your id colour`)
        .addStringOption(option => option.setName('hexcode').setDescription('hex colour code only!').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('title')
        .setDescription(`name or title!`)
        .addStringOption(option => option.setName('values').setDescription('name').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('socials')
        .setDescription(`art link`)
        .addStringOption(option => option.setName('weblink').setDescription('art page url').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('pronouns')
        .setDescription(`change your pronouns!`)
        .addStringOption(option => option.setName('values').setDescription('new pronouns').setRequired(true))),

    async execute(interaction, client) {

      // if (interaction.)

      await interaction.deferReply({ephemeral: true});

      const result = await UserData.findOne({userID: interaction.member.user.id});

      if (interaction.options.getSubcommand() === 'bio') {

        result.bio = interaction.options.getString('values');
        await result.save();

      }
      else if (interaction.options.getSubcommand() === 'interests') {
        // change the name of the server

        result.interests = interaction.options.getString('values');
        await result.save();

      }
      else if (interaction.options.getSubcommand() === 'pronouns') {
        // change the name of the server

        result.pronouns = interaction.options.getString('values');
        await result.save();

      }
      else if (interaction.options.getSubcommand() === 'socials') {
        // change the name of the server

        result.socialLink = interaction.options.getString('weblink');
        await result.save();

      }
      else if (interaction.options.getSubcommand() === 'picture') {
        // change the name of the server
        
        const { options } = interaction;
        const avatar = options.getAttachment('avatar');
          if (avatar.contentType.startsWith('image/')) {

            result.profilePicture = avatar.url;
            await result.save();

        }
        else {
          return interaction.editReply({ content: 'invalid link! must be a valid image!', ephemeral: true })
        }


      }
      else if (interaction.options.getSubcommand() === 'colour') {
        // change the name of the server

        if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(interaction.options.getString('hexcode'))) {
          return interaction.editReply({ content: 'Please provide a valid color in the format #RRGGBB\nhexcode finder:(https://g.co/kgs/YjmHzd).', ephemeral: true });
        }

        result.profileColour = interaction.options.getString('hexcode');
        await result.save();

      }
      else if (interaction.options.getSubcommand() === 'title') {
        // change the name of the server

        result.name = interaction.options.getString('values');
        await result.save();

      }

      await interaction.editReply({content: 'KIMO PASS updated!', embeds: [await kimoIDMaker(interaction.member.id, interaction.member, client)] , ephemeral: true });

    },
  };

