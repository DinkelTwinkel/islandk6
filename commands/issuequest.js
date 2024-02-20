const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

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
                .setDescription('how long they have to complete the quest')
                .setRequired(true),
                )
        .addStringOption(option =>
            option
                .setName('reward')
                .setDescription('what you are rewarding')
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
                ))
        .addAttachmentOption(option =>
            option
                .setName('questimage')
                .setDescription('upload quest banner image')
                .setRequired(true)),

	async execute(interaction) {

        if (!interaction.member.roles.cache.get('1203377553763475497')) return interaction.reply ({content: 'Only quest npcs can use this.', ephemeral: true});

        await interaction.deferReply({ ephemeral: true });
        
        const { options } = interaction;
        const avatar = options.getAttachment('questimage');

		if (avatar.contentType.startsWith('image/')) {
		await interaction.channel.send({ files: [{ attachment: avatar.url }] });
		interaction.editReply({ content: 'image posted', ephemeral: true });
		}
		else {
		interaction.editReply({ content: 'invalid image', ephemeral: true });
		}

        const quest = new EmbedBuilder()
        .setTitle(`📜 ${interaction.options.getString('title')}`)
        .setDescription('```' + `${interaction.options.getString('description')}` + '```')
        .addFields(
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

        const message = await interaction.channel.send({ embeds: [quest] });

        const thread = await message.startThread({
            name: '📜 QUEST: ' + `${interaction.options.getString('title')}`,
            autoArchiveDuration: 1440,
            // 24 hours
            type:  ChannelType.PublicThread,
            // flags: ThreadFlags.FLAGS.CREATED_FROM_MESSAGE,
          });

        return interaction.editReply({ content: 'quest created', ephemeral: true });

	},
};