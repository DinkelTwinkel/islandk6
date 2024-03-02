const Jail = require('../models/jailTracker');
const KimoTracker = require('../models/kimoTracker');
const { ActivityType, EmbedBuilder, Events } = require('discord.js');
const jailRelease = require('./jailRelease');
const jail = require('./jail');
const UserData = require('../models/userData');

module.exports = async (client) => {


    // every 5 s check if jailees need to be released.

    const KimoServer = await client.guilds.fetch('1193663232041304134');
    const botLogChannel = KimoServer.channels.cache.get('1202553664539983882');
    
    setInterval(async () => {

        // await KimoServer.members.fetch();
        const members = await KimoServer.members.cache.filter(member => member.roles.cache.has('1202749571957006348'));

        members.forEach(async jailedMember => {

            // if (jailedMember.roles.cache.get('1202749571957006348')) return;
            if (jailedMember.bot) return;
            
            const result = await Jail.findOne({userId: jailedMember.user.id});
            const userData = await UserData.findOne({ userID: jailedMember.user.id });

            const now = new Date();

            if (now.getTime() > result.timeToFree && userData.money > 0) {
                jailRelease(client, jailedMember);
            }

        });
        
    }, 1000 * 5);

    client.on(Events.MessageCreate, async (message) => {

        if (message.guild.id != KimoServer.id) return;
        if (message.member.roles.cache.get('1202749571957006348')) return;
        if (message.channel.id === '1206930735315943444') return;
        if (message.author.bot) return;

        const messageLowercase = message.content.toLowerCase();

        const bannedWords = ["retard", "andrew's underwear", "premo", "boney", "zuckerberg", "shemale", "boku no pico", "league of legends", "faggot", "tranny", "fag", "lesbo", "dyke", "stocks", "stock market", "ieague of iegends", "penis", "league оf legends", "pineapple island"];
        const replacementWord = ["sweetiepie", "JASON IS AWESOME", "i have found jesus", "honey darling", "my bum is itchy", "my love", "bby", "habibi", '[REDACTED]', '♥', "where is dio's pen"];

        bannedWords.forEach( async element => {
            //  || messageLowercase.includes(' ' + element) || messageLowercase.includes(element + ' ')  messageLowercase === element || 
            // console.log ('testing banned word');
            if (messageLowercase.includes(element) && messageLowercase != '!' + element) {

                console.log('banned word detected');

                const roleArray = [];
                message.member.roles.cache.forEach(role => {
                  roleArray.push(role.id);
                });
            
                let jailTracker = await Jail.findOne({ userId: message.member.id});
                if (!jailTracker) {
                    jailTracker= new Jail({
                        userId: message.member.id,
                        prename: message.member.displayName,
                        roles: roleArray,
                        numberOfTimesJailed: 0,
                    })
                }
            
                await jailTracker.save();
    
                console.log('feet message detected');
    
                if (!message.member.roles.cache.get('1210274450679922748')) {
                    const jailTime = jailTracker.numberOfTimesJailed * 5 + 1;
                    jail(client, message.member, `Used banned word: ${element}`, 'auto-sanitary-systems', jailTime);
                }

                // message.reply(`${message.member} has been sent to the dungeon for ${jailTime} mins for poor word choice. Social score lowered...`);
                message.member.roles.add('1202633002790948865');
    
                message.delete();

                const randomWord = replacementWord[Math.floor(Math.random() * replacementWord.length)];
                message.channel.send('```' + `${message.member.displayName}: ${replaceWord(messageLowercase, element, randomWord)}` + '```');
    
            }
            
        });

        if (messageLowercase.includes('feet')) {

            let jailTracker = await Jail.findOne({ userId: message.member.id});
            if (!jailTracker) {
                jailTracker= new Jail({
                    userId: message.member.id,
                    prename: message.member.displayName,
                    roles: [],
                    numberOfTimesJailed: 0,
                    feetMentionTracker: 1,
                })
            }
            else {
                jailTracker.feetMentionTracker += 1;
            }
        
            await jailTracker.save();

        }


    })

    


};

function replaceWord(originalString, targetWord, replacementWord) {
    // Use a regular expression with the 'g' flag to replace all occurrences
    var regex = new RegExp('\\b' + targetWord + '\\b', 'g');
    
    // Use the replace method to replace the target word with the replacement word
    var modifiedString = originalString.replace(regex, replacementWord);
    
    return modifiedString;
  }