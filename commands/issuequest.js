const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('issuequest')
		.setDescription('Let\'s you create a Quest')
        .addStringOption(option =>
			option
				.setName('title')
				.setDescription('title')
                .setRequired(true),
                )
		.addStringOption(option =>
			option
				.setName('description')
				.setDescription('description')
                .setRequired(true),
                )
        .addStringOption(option =>
            option
                .setName('timelimit')
                .setDescription('how long it should last')
                .setRequired(true),
                )
        .addStringOption(option =>
            option
                .setName('reward')
                .setDescription('how much to reward')
                .setRequired(true),
                )
        .addStringOption(option =>
            option
                .setName('colour')
                .setDescription('colour of quest')
                .setRequired(true)
                .addChoices(
                    { name: 'Pink', value: 'FF8EE0' },
                    { name: 'Orange', value: 'FF5733' },
                    { name: 'Blue', value: '8EA8FF' },
                    { name: 'Red', value: 'C5002D' },
                    { name: 'Black', value: '000000' },
                    { name: 'Green', value: '3fd467' },
                )),

	async execute(interaction) {

        if (!interaction.member.roles.cache.get('1203377553763475497')) return interaction.reply ({content: 'Only quest npcs can use this.', ephemeral: true});

        const quest = new EmbedBuilder()
        .setDescription(`Quest Issuer: ${interaction.member}`)
        .addFields(
            {
                name: `${interaction.options.getString('title')}`,
                value: `${interaction.options.getString('description')}`,
                inline: true,
            },
          {
            name: 'Time Limit',
            value: `${interaction.options.getString('timelimit')}`,
            inline: true,
          },
          {
            name: 'Reward',
            value: `${interaction.options.getString('reward')}`,
            inline: true,
          },
        )
        .setColor(`#${interaction.options.getString('colour')}`);

        console.log (quest);

        interaction.channel.send({ embeds: [quest] });

        return interaction.reply({ content: 'quest created', ephemeral: true });

	},
};