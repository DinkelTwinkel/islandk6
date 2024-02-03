const { Events } = require('discord.js');
const UserData = require('../models/userData');
const rulesKimoState = require('./rulesKimoState');
const rulesFigure = require('./rulesFigure');
const rulesRules = require('./rulesRules');
const rulesCredits = require('./rulesCredits');
const kimoIDMaker = require('./kimoIDMaker');
const rulesCommands = require('./rulesCommands');
const cooldowns = new Map();

module.exports = async (client) => {

    client.on(Events.InteractionCreate, async (interaction) => {

      if (!interaction.isButton()) return;

      console.log ('buttonclick detected')

      if (interaction.customId === 'rulesKimo') {

        rulesKimoState(client, interaction, interaction.customId);

      }
      else if (interaction.customId === 'rulesRules') {

        rulesRules(client, interaction, 'rulesRules');

      }
      else if (interaction.customId === 'rulesFigure') {

        rulesFigure(client, interaction, interaction.customId);

      }
      else if (interaction.customId === 'rulesCredits') {

        rulesCredits(client, interaction, interaction.customId);

      }
      else if (interaction.customId === 'rulesCommands') {

        rulesCommands(client, interaction, interaction.customId);

      }

      if (interaction.customId === 'showid') {

        const now = Date.now();
        const cooldownAmount = 5 * 60 * 1000;
        // 6 hours in milliseconds

        if (cooldowns.has(interaction.member.user.id)) {
            const expirationTime = cooldowns.get(interaction.member.user.id) + cooldownAmount;

            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000 / 60;
              return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more minutes before showing ID again`, ephemeral: true});
            }
        }
        cooldowns.set(interaction.member.user.id, now);

        interaction.reply ({ embeds: [ await kimoIDMaker(interaction.message.content)], ephemeral: false });
      }




      })
};
