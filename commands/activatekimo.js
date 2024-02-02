const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const KimoTracker = require('../models/kimoTracker');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('kill or set user to danger')
    .addStringOption(option =>
			option
				.setName('name')
				.setDescription('what is your name')
				.setRequired(true)),
    async execute(interaction, client) {

      const kimoTracker = await KimoTracker.findOne({serverId: interaction.guild.id });

      // if does not have participant role, or dead role. Allow use of this command.
      // generate user data. generate user state.

      // if (interaction.member.roles.cache.get (kimoTracker.participantRoleID) || interaction.member.roles.cache.get (kimoTracker.deadRoleID)) {
      //   return interaction.reply ({ content: 'You have already started Kimo. You cannot use this command', ephemeral: true });
      // }

      // generate user data, give roles. 
      
      // if already exists file, then just give roles.

      let userData = await UserData.findOne({userID: interaction.member.user.id});
      if (userData == null) {
        // generate
        userData = new UserData ({
          userID: interaction.member.user.id,
          socialLink: interaction.options.getString('name'),
          energy: 1,
          money: 0,
        })
      }
      
      userData.save();
      // interaction.member.setNickname(interaction.options.getString('name'));

      const kimoA = client.guilds.cache.get('1193663232041304134');
      const kimoALandingChannel = kimoA.channels.cache.get('1193665461699739738');
      const invite = await kimoALandingChannel.createInvite({
        maxAge: 10 * 60 * 1000,
        maxUses: 1,
      });

      interaction.reply({content: `discord.gg/${invite.code}`, ephemeral: true});

      // // send message to main channel.
      // const announcementChannel = interaction.guild.channels.cache.get('1202622607250296832');
      // announcementChannel.send(`${interaction.member} has arrived.`);

      // // give roles.
      // interaction.member.roles.set([kimoTracker.participantRoleID]);
      // interaction.reply ({content: '# Welcome to Kimodameshi 6', ephemeral: true});


    },
  };


