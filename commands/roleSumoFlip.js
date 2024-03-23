const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const kimoIDMaker = require('../patterns/kimoIDMaker');
const UserData = require('../models/userData');
const cost = 10;

const cooldowns = new Map();
const cooldownAmount = 1000 * 60 * 10;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('flip someone, costs 10 shells')
    .addUserOption(option =>
        option
            .setName('target')
            .setDescription('target to flip (costs 10 shells)')
            .setRequired(true)),

    async execute(interaction, client) {

        // QUEST NPC ROLE CHECK
        if (!interaction.member.roles.cache.get('1216662066220367903')) return interaction.reply({ content: 'You need to be a sumo to use this.', ephemeral: true });

        const now = Date.now();
        if (cooldowns.has(interaction.member.user.id)) {
            const expirationTime = cooldowns.get(interaction.member.user.id) + cooldownAmount;

            if (now < expirationTime) {
              const timeLeft = (expirationTime - now) / 1000 / 60;
              return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more minutes before flipping again`, ephemeral: true});
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

        const targetName = upsideDownText(oldName);

        target.setNickname(targetName);

        interaction.channel.send ('https://tenor.com/view/akua-terutsuyoshi-kakenage-sumo-gif-25170050');
        interaction.reply({ content: `${oldName} has been flipped! Their new name is ${targetName}`, ephemeral: false });

    },
  };

  function upsideDownText(text) {
    const upsideDownChars = {
        a: 'ɐ',
        b: 'q',
        c: 'ɔ',
        d: 'p',
        e: 'ǝ',
        f: 'ɟ',
        g: 'ƃ',
        h: 'ɥ',
        i: 'ı',
        j: 'ɾ',
        k: 'ʞ',
        l: 'l',
        m: 'ɯ',
        n: 'u',
        o: 'o',
        p: 'd',
        q: 'b',
        r: 'ɹ',
        s: 's',
        t: 'ʇ',
        u: 'n',
        v: 'ʌ',
        w: 'ʍ',
        x: 'x',
        y: 'ʎ',
        z: 'z',
        A: '∀',
        B: '𐐒',
        C: 'Ɔ',
        D: '◖',
        E: 'Ǝ',
        F: 'Ⅎ',
        G: 'פ',
        H: 'H',
        I: 'I',
        J: 'ſ',
        K: '⋊',
        L: '⅃',
        M: 'W',
        N: 'N',
        O: 'O',
        P: 'Ԁ',
        Q: 'Ό',
        R: 'ᴚ',
        S: 'S',
        T: '⊥',
        U: '∩',
        V: 'Λ',
        W: 'M',
        X: 'X',
        Y: 'ʎ',
        Z: 'Z',
        0: '0',
        1: 'Ɩ',
        2: 'ᄅ',
        3: 'Ɛ',
        4: 'ㄣ',
        5: 'ϛ',
        6: '9',
        7: 'ㄥ',
        8: '8',
        9: '6',
        '.': '˙',
        ',': "'",
        '?': '¿',
        '!': '¡',
        "'": ',',
        '"': ',,',
        '`': ',',
        '^': 'v',
        '<': '>',
        '>': '<',
        '∴': '∵'
    };
    
    const chars = text.split('');
    let upsideDownText = '';
    for (let char of chars) {
        upsideDownText += upsideDownChars[char] || char;
    }
    return upsideDownText.split('').reverse().join('');
}