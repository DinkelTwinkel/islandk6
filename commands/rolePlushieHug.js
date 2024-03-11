const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const cost = 10;

const cooldowns = new Map();
const cooldownAmount = 1000 * 60 * 20;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('hug someone! (costs 10 shells)')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('target to hug')
            .setRequired(true)),

    async execute(interaction, client) {

        // QUEST NPC ROLE CHECK
        if (!interaction.member.roles.cache.get('1216558325970501633')) return interaction.reply({ content: 'You need a plushie to give out hugs.', ephemeral: true });

        const now = Date.now();
        if (cooldowns.has(interaction.member.user.id)) {
            const expirationTime = cooldowns.get(interaction.member.user.id) + cooldownAmount;

            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000 / 60;
              return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more minutes before giving hugs again`, ephemeral: true});
            }
        }

        const userWallet = await UserData.findOne({ userID: interaction.member.id });
        if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to use this.`, ephemeral: true });
        userWallet.money -= cost;
        await userWallet.save();

        const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
        jianDaoWallet.money += cost;
        await jianDaoWallet.save();

        const target = interaction.options.getMember('target');

        if (Math.random() > 0.9) {
          const targetName = modifyString(target.displayName);
          target.setNickname(targetName);
          interaction.reply({ content: `**${target.displayName}** has been given a hug! They become loved?!`, ephemeral: false });
        }
        else if (Math.random() > 0.9) {

          const self = await UserData.findOne({ userID: interaction.member.id });
          self.money += cost;
          await self.save();

          const targetMoney = await UserData.findOne({ userID: target.id });
          targetMoney.money += cost;
          await targetMoney.save();

          interaction.reply({ content: `**${target.displayName}** has been given a hug! You guys found ${cost} together?`, ephemeral: false });

        }
        else {
          interaction.reply({ content: `**${target.displayName}** has been given a hug!`, ephemeral: false });
        }


    },
  };

  function modifyString(str) {
    // Generate a random number between 0 and 1
    const random = Math.random();
  
    // 30% chance to uppercase the string
    if (random < 0.5) {
      str = str.toUpperCase();
    }
  
    // 10% chance to add love hearts on either end of the string
    if (random < 0.5) {
      const hearts = "❤️";
      str = hearts + str + hearts;
    }

    if (random < 0.3) {
      const hearts = "❤️";
      str = hearts + str + hearts;
    }

    if (random < 0.1) {
      const hearts = "❤️";
      str = hearts + str + hearts;
    }
  
    return str;
  }