const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const KimoTracker = require('../models/kimoTracker');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('id')
    .setDescription('show info')
    .addUserOption(option =>
			option
				.setName('member')
				.setDescription('see someone')
				.setRequired(false)),
    async execute(interaction) {



    },
  };
