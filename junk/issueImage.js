const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('issuequestimage')
		.setDescription('Let\'s you post a quest image')
		.addAttachmentOption(option =>
			option
				.setName('questimage')
				.setDescription('quest banner image')
				.setRequired(true)),

	async execute(interaction) {

		if (!interaction.member.roles.cache.get('1203377553763475497')) return interaction.reply ({content: 'Only quest npcs can use this.', ephemeral: true});

		await interaction.deferReply({ ephemeral: true });
        
        const { options } = interaction;
        const avatar = options.getAttachment('questimage');

		if (avatar.contentType.startsWith('image/')) {
		interaction.channel.send({ files: [{ attachment: avatar.url }] });
		return interaction.editReply({ content: 'image posted', ephemeral: true });
		}
		else {
			interaction.editReply({ content: 'invalid image', ephemeral: true });
		}

	},
};