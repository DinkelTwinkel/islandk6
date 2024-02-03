const {ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder } = require('discord.js');

module.exports = async (customID) => {

    const kimoButton = new ButtonBuilder ()
    .setCustomId('rulesKimo')
    .setLabel('KIMO\nSTATE')
    .setStyle(ButtonStyle.Secondary)

    console.log (customID);

    if (customID === 'rulesKimo') {
        kimoButton.setDisabled(true);
    }

    const rulesButton = new ButtonBuilder ()
    .setCustomId('rulesRules')
    .setLabel('RULES')
    .setStyle(ButtonStyle.Danger)

    if (customID === 'rulesRules') {
        rulesButton.setDisabled(true);
    }

    const figureButton = new ButtonBuilder ()
    .setCustomId('rulesFigure')
    .setLabel('WHAT IS A FIGURE?')
    .setStyle(ButtonStyle.Secondary)

    if (customID === 'rulesFigure') {
        figureButton.setDisabled(true);
    }

    const credits = new ButtonBuilder ()
    .setCustomId('rulesCredits')
    .setLabel('CREDITS')
    .setStyle(ButtonStyle.Secondary)

    if (customID === 'rulesCredits') {
        credits.setDisabled(true);
    }

    const commands = new ButtonBuilder ()
    .setCustomId('rulesCommands')
    .setLabel('COMMANDS')
    .setStyle(ButtonStyle.Secondary)

    if (customID === 'rulesCommands') {
        commands.setDisabled(true);
    }

    const row = new ActionRowBuilder()
    .setComponents(kimoButton, rulesButton, figureButton, commands, credits)

    return row;


};
