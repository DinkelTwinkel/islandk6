const { Events } = require('discord.js');
const UserData = require('../models/userData');
const rulesKimoState = require('./rulesKimoState');
const rulesFigure = require('./rulesFigure');

module.exports = async (client) => {

    client.on(Events.InteractionCreate, async (interaction) => {

      if (!interaction.isButton()) return;

      console.log ('buttonclick detected')

      if (interaction.customId === 'rulesKimo') {

        rulesKimoState(client, interaction, interaction.customId);

      }
      else if (interaction.customId === 'rulesRules') {

      }
      else if (interaction.customId === 'rulesFigure') {

        rulesFigure(client, interaction, interaction.customId);

      }
      else if (interaction.customId === 'rulesCredits') {

      }




      })
};
