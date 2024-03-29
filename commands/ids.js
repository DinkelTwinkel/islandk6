const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('id')
    .setDescription('see id card')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('see their id')
            .setRequired(false)),

    async execute(interaction, client) {

    const showIDButton = new ButtonBuilder ()
    .setCustomId('showid')
    .setLabel('show')
    .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder ()
    .addComponents(showIDButton);
    
    await interaction.deferReply({ephemeral: true});

    if (interaction.options.getMember('target')) {
        const targetID =  interaction.options.getMember('target').id;
        interaction.editReply ({ embeds: [ await kimoIDMaker(targetID, interaction.options.getMember('target'), client)], ephemeral: true });
    }
    else {
        interaction.editReply ({ content: interaction.member.id, embeds: [ await kimoIDMaker(interaction.member.id, interaction.member, client)], ephemeral: true, components: [] });
    }

    },
  };

