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
    .setCustomId('showID')
    .setLabel('show')
    .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder ()
    .addComponents(showIDButton);

    if (interaction.options.getMember('target')) {
        interaction.reply ({ embeds: [ await kimoIDMaker(interaction.options.getMember('target').id)], ephemeral: true, components: [row] });
    }
    else {
        interaction.reply ({ embeds: [ await kimoIDMaker(interaction.member.id)], ephemeral: true, components: [row] });
    }

    },
  };

