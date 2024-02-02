const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cleaner')
		.setDescription('Cleans the last 100 messages in a channel')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('the last x amount of messages'),
        ),

	async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content:'You cannot use this', ephemeral: true });
        }
        const amount = interaction.options.getInteger('amount') || 10;

        const channel = interaction.channel;

        interaction.reply({ content: 'Last ' + amount + ' messages deleted in ' + channel.name, ephemeral: true });
        channel.messages.fetch({ limit: amount })
        .then(messages => {
            // Delete all fetched messages
            channel.bulkDelete(messages);
        })
        .catch(console.error);

	},
};