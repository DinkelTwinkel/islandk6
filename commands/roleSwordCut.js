const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const cost = 10;

const cooldowns = new Map();
const cooldownAmount = 1000 * 60 * 10;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('cut')
    .setDescription('cut someone, costs 10 shells')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('target to cut (costs 10 shells)')
            .setRequired(true)),

    async execute(interaction, client) {

        // QUEST NPC ROLE CHECK
        if (!interaction.member.roles.cache.get('1216662066220367903')) return interaction.reply({ content: 'You need a sword to use this.', ephemeral: true });

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

        cooldowns.set(interaction.member.user.id, now);

        const target = interaction.options.getMember('target');

        const oldName = target.displayName;

        if (Math.random() > 0.5) {

          const targetName = randomlyModifyString(target.displayName);

          target.setNickname(targetName);


          interaction.reply({ content: `${oldName} has been given a fresh trim! Their new name is ${targetName}`, ephemeral: false });

        }
        else {

          const targetName = convertToGothic(target.displayName);

          target.setNickname(targetName);

          interaction.reply({ content: `${oldName} has been given a fresh trim! Their new name is ${targetName}`, ephemeral: false });

        }



    },
  };

function randomlyModifyString(str) {
    // Check if the string has multiple words
    const words = str.split(" ");
    if (words.length > 1) {
      // If multiple words, randomly remove a word
      const randomIndex = Math.floor(Math.random() * words.length);
      words.splice(randomIndex, 1);
      return words.join(" ");
    } else {
      // If only one word, randomly cut it in half
  // Generate a random index to split the string
  const splitIndex = Math.floor(Math.random() * str.length);
  
  // Slice the string at the random index
  const firstHalf = str.slice(0, splitIndex);
  const secondHalf = str.slice(splitIndex);

  if (Math.random() > 0.5) {
    return firstHalf;
  }
  else {
    return secondHalf;
  }
    }
  }

  function convertToGothic(text) {
    const gothicMap = {
      a: "𝖆", b: "𝖇", c: "𝖈", d: "𝖉", e: "𝖊",
      f: "𝖋", g: "𝖌", h: "𝖍", i: "𝖎", j: "𝖏",
      k: "𝖐", l: "𝖑", m: "𝖒", n: "𝖓", o: "𝖔",
      p: "𝖕", q: "𝖖", r: "𝖗", s: "𝖘", t: "𝖙",
      u: "𝖚", v: "𝖛", w: "𝖜", x: "𝖝", y: "𝖞",
      z: "𝖟", A: "𝕬", B: "𝕭", C: "𝕮", D: "𝕯",
      E: "𝕰", F: "𝕱", G: "𝕲", H: "𝕳", I: "𝕴",
      J: "𝕵", K: "𝕶", L: "𝕷", M: "𝕸", N: "𝕹",
      O: "𝕺", P: "𝕻", Q: "𝕼", R: "𝕽", S: "𝕾",
      T: "𝕿", U: "𝖀", V: "𝖁", W: "𝖂", X: "𝖃",
      Y: "𝖄", Z: "𝖅"
    };
  
    return Array.from(text, char => gothicMap[char] || char).join("");
  }