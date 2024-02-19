const { SlashCommandBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const KimoTracker = require('../models/kimoTracker');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Hello WORLD!')
    .addStringOption(option =>
			option
				.setName('name')
				.setDescription('What do you go by')
				.setRequired(true))
    .addStringOption(option =>
      option
        .setName('pronouns')
        .setDescription('how do you like to be referred by')
        .setRequired(true))
    .addStringOption(option =>
        option
          .setName('socials')
          .setDescription('where do you post your art')
          .setRequired(true)),
    async execute(interaction, client) {

        if (interaction.member.roles.cache.has ('1202551817708507136') || interaction.member.roles.cache.has ('1202876101005803531') ) {
            return interaction.reply({content: 'You cannot use this.', ephemeral: true});
        }

      const kimoTracker = await KimoTracker.findOne({ serverId: interaction.guild.id });

      // generate. code.

      let dice;

      if (Math.random() < 0.5) {
        dice = 0;
      }
      else {
        dice = 1;
      }

      console.log ('DICE ' + dice);

      let result = await UserData.findOne({ userID: interaction.member.user.id })

      const name = interaction.options.getString('name');
      const pronouns = interaction.options.getString('pronouns');
      const socials = interaction.options.getString('socials');

      if (result == null) {

          result = new UserData ({
            userID: interaction.member.user.id,
            name: name,
            socialLink: socials,
            pronouns: pronouns,
            energy: 1,
            money: 0,
            group: dice,
            profileColour: generateRandomHexColor(),
          })

      }

      result.name = name;
      result.socialLink = socials;
      result.pronouns = pronouns;
      result.profilePicture = interaction.member.displayAvatarURL();

      await result.save();

      const yes = new ButtonBuilder()
      .setCustomId('startyes')
      .setLabel('yes')
      .setStyle(ButtonStyle.Secondary);

      const no = new ButtonBuilder()
      .setCustomId('startno')
      .setLabel('no')
      .setStyle(ButtonStyle.Secondary);

      const firstRow = new ActionRowBuilder ()
      .addComponents(yes, no);

      interaction.member.setNickname(name);

      const embed = new EmbedBuilder()
      .setDescription('```' + `Unknown:  "HEY."` + '```' + '```' + `\nUnknown: "FIRST TIME HERE??"` + '```');

      interaction.reply ({content: '', ephemeral: true, embeds: [embed], components: [firstRow]});


    },
  };

  function generateRandomHexColor() {
    // Generate a random number and convert it to a hexadecimal string
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    
    // Pad the string with zeros to ensure it is always 6 digits long
    const hexColor = "#" + "0".repeat(6 - randomColor.length) + randomColor;
    
    return hexColor;
  }