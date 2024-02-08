const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('issuequestimage')
		.setDescription('Let\'s you post a quest image')
		.addStringOption(option =>
			option
				.setName('imagelink')
				.setDescription('CDN LINKS')
                .setRequired(true),
                ),

	async execute(interaction) {

		if (!interaction.member.roles.cache.get('1203377553763475497')) return interaction.reply ('Only quest npcs can use this.');

        interaction.channel.send({ files: [{ attachment: interaction.options.getString('imagelink') }] });

        return interaction.reply({ content: 'image posted', ephemeral: true });

	},
};