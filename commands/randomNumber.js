const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('random')
    .setDescription('get a random number between 0 and....')
    .addIntegerOption(option =>
        option
            .setName('limit')
            .setDescription('upperlimit of random number')
            .setRequired(true),
    ),

    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: false });
        await interaction.editReply({ content: 'picking random... :postbox:' });

        const upperlimit = interaction.options.getInteger('limit');

        const dice = Math.floor(Math.random() * upperlimit) + 1;

        setTimeout(() => {
            interaction.editReply({ content: `RANDOM OF ${upperlimit} = ${dice}` });
        }, 1000);
    },
  };

