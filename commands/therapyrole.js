const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('therapy')
    .setDescription('stop, get some help, toggles new channel.'),

    async execute(interaction, client) {

      const kimoServer =  await client.guilds.fetch('1193663232041304134');
      await kimoServer.members.fetch();
      const therapyRole = kimoServer.roles.cache.get('1205106840061485089');
      const member = kimoServer.members.cache.get(interaction.member.user.id);

      if (member.roles.cache.has(therapyRole.id)) {
          member.roles.remove(therapyRole);
          interaction.reply({ content: 'therapy channel removed', ephemeral: true });
      }
      else {
          member.roles.add(therapyRole);
          interaction.reply({ content: 'therapy channel added', ephemeral: true });
      }

    },
  };
