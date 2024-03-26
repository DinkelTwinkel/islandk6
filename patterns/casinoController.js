const KimoTracker = require('../models/kimoTracker');
const { ActivityType, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionCollector, ChannelType} = require('discord.js');
const UserData = require('../models/userData');

module.exports = async (client) => {

    client.on(Events.MessageCreate, async (message) => {

        if (message.guild.id != '1193663232041304134') return;

        if (message.content.startsWith('!')) {
            console.log('commandDetected');
            // Extract the command and any arguments
            const args = message.content.slice(1).trim().split(/ +/);
            const command = args.shift().toLowerCase();
        
            // Check the command and respond

            if (command === 'rps') {

                const embed = new EmbedBuilder()
                .setAuthor({
                  name: "Goblin's Gambling House",
                  iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1222201371995144253/dd442co-7c629952-16ab-4b6e-82df-622d874200db.gif?ex=66155aba&is=6602e5ba&hm=f50bed09a4fb850b035c296f494c666e19a23e04412d1330f1dec5c1644ec090&",
                })
                .setDescription("```ROCK PAPER SCISSORS\n> PICK ONE OF THE OPTIONS BELOW TO PLAY.\n> 10 SHELLS FOR ROCK\n> 100 SHELLS FOR PAPER\n> 1000 SHELLS FOR SCISSORS```\n*WINNINGS ARE DOUBLED.*")
                .setThumbnail("https://cdn.discordapp.com/attachments/1061965352755544084/1222210424263671808/image.png?ex=66156328&is=6602ee28&hm=271abfb54d2bc2f41d0eb5e7428bb1d4a50e663bd514f6ad838cf4cb19e87788&")
                .setFooter({
                  text: "goblin drawing by big boi",
                });
              
                const rockButton = new ButtonBuilder ()
                .setCustomId('rock')
                .setLabel('ROCK')
                .setStyle(ButtonStyle.Secondary);
                
                const paperButton = new ButtonBuilder ()
                .setCustomId('paper')
                .setLabel('PAPER')
                .setStyle(ButtonStyle.Primary);

                const scissorButton = new ButtonBuilder ()
                .setCustomId('scissor')
                .setLabel('SCISSOR')
                .setStyle(ButtonStyle.Danger);
        
                const powerRow = new ActionRowBuilder ()
                .addComponents(rockButton,paperButton,scissorButton);

                const casinoMessage = await message.channel.send ({embeds: [embed], components: [powerRow]});

                const thread = await casinoMessage.startThread({
                    name: 'ROCK PAPER SCISSORS',
                    autoArchiveDuration: 1440,
                    // 24 hours
                    type:  ChannelType.PublicThread,
                    // flags: ThreadFlags.FLAGS.CREATED_FROM_MESSAGE,
                });

            }
        }

    })

    client.on(Events.InteractionCreate, async (interaction) => {

        if (!interaction.isButton()) return;
  
        console.log ('buttonclick detected')
  
        if (interaction.customId === 'rock') {
            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 10;
            const userWallet = await UserData.findOne({ userID: interaction.member.id });
            if (userWallet.money < cost) return thread.send ({ content: `${interaction.member} Insufficient shells, you need ${cost} shells to play this`, ephemeral: true });

            const jianDaoWallet = await UserData.findOne({ userID: '865147754358767627' });
            if (jianDaoWallet.money < cost) return thread.send ({ content: `${interaction.member} Goblin is too broke to play this wager`, ephemeral: true });

            const playMessage = await thread.send (`${interaction.member} played **rock**!`);

            const dice = Math.random() * 3;
    
            if (2 > dice > 0.99) {
                playMessage.reply (`Goblin played paper! You lose ${cost} shells!`);
                userWallet.money -= cost;
                jianDaoWallet.money += cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
            else if (dice > 2) {
                playMessage.reply (`Goblin played rock! It's a draw!`);
            }
            else {
                playMessage.reply (`Goblin played scissor! You win ${cost} shells!`);
                userWallet.money += cost;
                jianDaoWallet.money -= cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
        }

        if (interaction.customId === 'paper') {
            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 100;
            const userWallet = await UserData.findOne({ userID: interaction.member.id });
            if (userWallet.money < cost) return thread.send ({ content: `${interaction.member} Insufficient shells, you need ${cost} shells to play this`, ephemeral: true });

            const jianDaoWallet = await UserData.findOne({ userID: '865147754358767627' });
            if (jianDaoWallet.money < cost) return thread.send ({ content: `${interaction.member} Goblin is too broke to play this wager`, ephemeral: true });

            const playMessage = await thread.send (`${interaction.member} played **paper**!`);

            const dice = Math.random() * 3;
    
            if (2 > dice > 0.99) {
                playMessage.reply (`Goblin played scissors! You lose ${cost} shells!`);
                userWallet.money -= cost;
                jianDaoWallet.money += cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
            else if (dice > 2) {
                playMessage.reply (`Goblin played paper! It's a draw!`);
            }
            else {
                playMessage.reply (`Goblin played rock! You win ${cost} shells!`);
                userWallet.money += cost;
                jianDaoWallet.money -= cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
        }

        if (interaction.customId === 'scissor') {
            await interaction.deferUpdate();
            const thread = interaction.channel.threads.cache.find(x => x.id === interaction.message.id);

            const cost = 1000;
            const userWallet = await UserData.findOne({ userID: interaction.member.id });
            if (userWallet.money < cost) return thread.send ({ content: `${interaction.member} Insufficient shells, you need ${cost} shells to play this`, ephemeral: true });

            const jianDaoWallet = await UserData.findOne({ userID: '865147754358767627' });
            if (jianDaoWallet.money < cost) return thread.send ({ content: `${interaction.member} Goblin is too broke to play this wager`, ephemeral: true });

            const playMessage = await thread.send (`${interaction.member} played **scissors**!`);

            const dice = Math.random() * 3;
    
            if (2 > dice > 0.99) {
                playMessage.reply (`Goblin played rock! You lose ${cost} shells!`);
                userWallet.money -= cost;
                jianDaoWallet.money += cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
            else if (dice > 2) {
                playMessage.reply (`Goblin played scissors! It's a draw!`);
            }
            else {
                playMessage.reply (`Goblin played paper! You win ${cost} shells!`);
                userWallet.money += cost;
                jianDaoWallet.money -= cost;
                await jianDaoWallet.save();
                await userWallet.save();
            }
        }

    })


};
