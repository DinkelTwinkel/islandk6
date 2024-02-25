// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Events, GatewayIntentBits, ActivityType, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, Partials } = require('discord.js');
const { token, mongourl } = require('./keys.json');
const { kimoServerID, botLogChannelID, deadRoleID } = require('./ids.json');
require('log-timestamp');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates], partials: [
  Partials.Channel,
  Partials.Message,
  Partials.Reaction,
  Partials.User,
] });

const mongoose = require('mongoose');

  mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to KimoMiniDB'))
    .catch((err) => console.log(err));

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'

const registerCommands = require ('./registerCommands');
const KimoTracker = require('./models/kimoTracker');
const UserData = require('./models/userData');
const startSeq = require('./patterns/startSeq');
const cutOffClock = require('./patterns/cutOffClock');
const dailySLICE = require('./patterns/dailySLICE');
const reactionRewards = require('./patterns/reactionRewards');
const radio = require('./patterns/radio');
const rulesButtonListeners = require('./patterns/rulesButtonListeners');
const sushiConveyor = require('./patterns/sushiConveyor');
const jailAuto = require('./patterns/jailAuto');
const sushiConveyor2 = require('./patterns/sushiConveyor2');
const postDailyTasker = require('./patterns/postDailyTasker');
const DangerRoleColourShifting = require('./patterns/DangerRoleColourShifting');
const journalFinding = require('./patterns/journalFinding');
const postScissorChan = require('./patterns/postScissorChan');
const stockBuySellFluctuations = require('./patterns/stockBuySellFluctuations');
const Stats = require('./models/statistics');
const eventVCLock = require('./patterns/eventVCLock');
const UserStats = require('./models/userStatistics');
const fleaMarketController = require('./patterns/fleaMarketController');
const honourTheFallen = require('./patterns/honourTheFallen');
const kickall = require('./patterns/kickall');
const forceRecheck = require('./patterns/forceRecheck');
const outPutFinalFile = require('./patterns/outPutFinalFile');
const slaughter = require('./patterns/slaughter');
const UserState = require('./models/userState');
const adminReact = require('./patterns/adminReact');
const Jail = require('./models/jailTracker');
const campfireVCs = require('./patterns/campfireVCs');
const Stock = require('./models/stock');
registerCommands;

client.once(Events.ClientReady, async c => {

	console.log(`Ready! Logged in as ${c.user.tag}`);

  const kimoServer = await client.guilds.fetch (kimoServerID);
  const botLogChannel = kimoServer.channels.cache.get(botLogChannelID);
  botLogChannel.send (`# I've awoken.`);
  //botLogChannel.send('!assignall');

  const KimoServer = await client.guilds.fetch(kimoServerID);
  const memberCount = await KimoServer.members.fetch();
  console.log ('total server members: ' + memberCount.size);

  startSeq(client, kimoServer);
  cutOffClock(client);
  dailySLICE(client);
  radio(client);
  rulesButtonListeners(client);
  jailAuto(client);
  postDailyTasker(client);
  DangerRoleColourShifting(client);
  journalFinding(client);
  postScissorChan(client);
  stockBuySellFluctuations(client);
  eventVCLock(client);
  fleaMarketController(client);
  adminReact(client);
  campfireVCs(client);

  setInterval(() => {
    dailySLICE(client);
  }, 1000 * 1);

  setInterval(() => {
    //botLogChannel.send('!assignall');
  }, 1000 * 60 * 60);

  reactionRewards(client);

  // Wave Conveyer
  const waveChannels = ['1203395035018829915', '1203610316210966558', '1203358217271246983', '1203358105384259684', '1203358412876812338', '1203358444535685140', '1203392330296467590']

  waveChannels.forEach(async channelID => {
    const sushiChannel = kimoServer.channels.cache.get(channelID);
    sushiChannel.setName (await sushiConveyor(sushiChannel.name));
  });

  const specialWaveChannel = kimoServer.channels.cache.get('1203354315176022017');
  specialWaveChannel.setName (await sushiConveyor2(specialWaveChannel.name));

  setInterval(async () => {
    waveChannels.forEach(async channelID => {
      const sushiChannel = kimoServer.channels.cache.get(channelID);
      sushiChannel.setName (await sushiConveyor(sushiChannel.name));
    });

    const specialWaveChannel = kimoServer.channels.cache.get('1203354315176022017');
    specialWaveChannel.setName (await sushiConveyor2(specialWaveChannel.name));
    
  }, 1000 * 60 * 5);

  // campfire vc emoji
  // const campfireChannels = ['1202623019122434048', '1202623019122434048'];
  const microwaveChannels = ['1202877555053428766', '1202632696296382505'];
  const caveChannels = ['1202877492512432128', '1202623019122434048'];

  setInterval(async () => {

    // campfireChannels.forEach(id => {
    //   const channel = kimoServer.channels.cache.get(id)
    //   if (Math.random() > 0.5) {
    //     channel.setName('🔥 campfire');
    //   }
    //   else {
    //     channel.setName('campfire');
    //   }
    // });
  
    caveChannels.forEach(id => {
      const channel = kimoServer.channels.cache.get(id)
      if (Math.random() > 0.5) {
        channel.setName('🐼 cave');
      }
      else {
        channel.setName('cave');
      }
    });
  
    microwaveChannels.forEach(id => {
      const channel = kimoServer.channels.cache.get(id)
      if (Math.random() > 0.5) {
        channel.setName('⚡ microwave');
      }
      else {
        channel.setName('microwave');
      }
    });


  }, 1000 * 60 * 10);

// await Stock.updateMany({$set:
//     {
//       nextUpdateTime: 0,
//     }
//  });

});

// new user join auto role
client.on(Events.GuildMemberAdd, async (member) => {
  // updateUserState(member);
  const statTrak = await Stats.findOne({serverID: kimoServerID});
  statTrak.totalEntries += 1;
  await statTrak.save();

  const result = await UserStats({ userID: member.user.id });
  if (result) {
    return;
  }

  const newStatTrack = new UserStats ({
    userID: member.user.id,
  })
  await newStatTrack.save();

  let userState = await UserState.findOne({ userID: member.user.id });

  if (userState) {
    userState.currentState = 'DANGER';
    await userState.save();
  }

});

client.on(Events.InteractionCreate, async (interaction) => {

  if (interaction.customId === 'giveAdmin') {

          interaction.deferUpdate();

          const kimoServer =  await client.guilds.fetch('1193663232041304134');

          await kimoServer.members.fetch();
          const adminRole = kimoServer.roles.cache.get('1202534470780063784');
          const member = kimoServer.members.cache.get(interaction.member.user.id);

          if (member.roles.cache.has(adminRole.id)) {
              member.roles.remove(adminRole);
              interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ʀᴇᴍᴏᴠᴇᴅ`');
          }
          else {
              member.roles.add(adminRole);
              interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ᴀᴅᴅᴇᴅ`');
          }
  }

  if (interaction.customId === 'allSeeingEyes') {

    interaction.deferUpdate();

    const kimoServer =  await client.guilds.fetch('1193663232041304134');

    await kimoServer.members.fetch();
    const adminRole = kimoServer.roles.cache.get('1202534566607200266');
    const member = kimoServer.members.cache.get(interaction.member.user.id);

    if (member.roles.cache.has(adminRole.id)) {
        member.roles.remove(adminRole);
        interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ʀᴇᴍᴏᴠᴇᴅ`');
    }
    else {
        member.roles.add(adminRole);
        interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ᴀᴅᴅᴇᴅ`');
    }
}

if (interaction.customId === 'lifeguardRole') {

  interaction.deferUpdate();

  const kimoServer =  await client.guilds.fetch('1193663232041304134');

  await kimoServer.members.fetch();
  const adminRole = kimoServer.roles.cache.get('1202555128352346143');
  const member = kimoServer.members.cache.get(interaction.member.user.id);

  if (member.roles.cache.has(adminRole.id)) {
      member.roles.remove(adminRole);
      interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ʀᴇᴍᴏᴠᴇᴅ`');
  }
  else {
      member.roles.add(adminRole);
      interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ᴀᴅᴅᴇᴅ`');
  }
}

if (interaction.customId === 'botlog') {

  interaction.deferUpdate();

  const kimoServer =  await client.guilds.fetch('1193663232041304134');

  await kimoServer.members.fetch();
  const adminRole = kimoServer.roles.cache.get('1202553750523478036');
  const member = kimoServer.members.cache.get(interaction.member.user.id);

  if (member.roles.cache.has(adminRole.id)) {
      member.roles.remove(adminRole);
      interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ʀᴇᴍᴏᴠᴇᴅ`');
  }
  else {
      member.roles.add(adminRole);
      interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ᴀᴅᴅᴇᴅ`');
  }
}

if (interaction.customId === 'questNpcRole') {

  interaction.deferUpdate();

  const kimoServer =  await client.guilds.fetch('1193663232041304134');

  await kimoServer.members.fetch();
  const adminRole = kimoServer.roles.cache.get('1203377553763475497');
  const member = kimoServer.members.cache.get(interaction.member.user.id);

  if (member.roles.cache.has(adminRole.id)) {
      member.roles.remove(adminRole);
      interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ʀᴇᴍᴏᴠᴇᴅ`');
  }
  else {
      member.roles.add(adminRole);
      interaction.message.edit('`ᴀᴅᴍɪɴ ʀᴏʟᴇ ᴀᴅᴅᴇᴅ`');
  }
}

});

// auto delete messages in certain channels
client.on(Events.MessageCreate, async (message) => {
  // const kimoTracker = await KimoTracker.findOne({ serverId: message.guild.id });
  // intro channel
  if (message.channel.id === '1202878435639304212' && !message.author.bot ) {
    message.delete();
  }

  // ref channels.
  if ((message.channel.id === '1202622867863506945' && !message.author.bot) || (message.channel.id === '1202877025032081438' && !message.author.bot)) {
    const confirmationMessage = await message.reply('```you cannot send messages here! Please use /shareref to add to this channel.```');
    setTimeout(() => {
        confirmationMessage.delete();
    }, 3 * 1000);
    message.delete();
  }
  // if last words, resend to other last words.

  if (message.channel.id === '1202633424381153300' && !message.author.bot ) {
    // find other last words channel and resend there. 
    const backStageServer = client.guilds.cache.get('1063167135939039262');
    const backStageLastwords = backStageServer.channels.cache.get('1203782984268783656');
    backStageLastwords.send(`${message.member.displayName}: "${message.content}"`);
  }

})

//JASON ONLY Secret Commands 
//Check if user is also in the hell mart discord. Only work if so.
client.on(Events.MessageCreate, async (message) => {

  if (message.member.user.id != '865147754358767627' && message.member.user.id != '236216554235232256') return;

  if (message.content.startsWith('!')) {
      console.log('commandDetected');
      // Extract the command and any arguments
      const args = message.content.slice(1).trim().split(/ +/);
      const command = args.shift().toLowerCase();
  
      // Check the command and respond

      if (command === 'createkimo') {
        console.log('createKimoDetected');

        const result = await KimoTracker.findOne({ serverId: message.guild.id });
        const currentDate = new Date();

        if (result) {
          message.reply ('Server Document Already Exists.');
          return;
        }
        else {
          const newKimoServer = new KimoTracker ({ 
            serverId: message.guild.id,
            currentDate: currentDate.getDay(),
            nextDate: currentDate.getDay(),
            kimoActive: false,
          })
          await newKimoServer.save();
          message.reply ('New Server Document Created');
        }
      } 

      if (command === 'kickdead') {
        console.log('kickDeadCommandDetected');
        const KimoServer = await client.guilds.fetch(kimoServerID);
        const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
        const members = KimoServer.members.cache.filter(member => member.roles.cache.has(deadRoleID));

        botLogChannel.send(`kick dead command detected:`);

        members.forEach(async member => {
          member.kick();
          botLogChannel.send(`kicking ${member}`);
        })

      } 

      if (command === 'honour') {

        honourTheFallen(client, message.channel);

      } 

      if (command === 'rollcredits') {

        outPutFinalFile(client, message.channel);

      } 

      if (command === 'kickall') {

        kickall(client);

      } 

      if (command === 'slaughter') {

        slaughter(client);

      } 

      if (command === 'resetcutoff') {

        const result = await KimoTracker.findOne({serverId: kimoServerID});
        result.slaughter = false;
        result.kimoActive = false;
        result.currentPeriodLength = (1000 * 60 * 60 * 24);

        const now = new Date();

        now.setHours(12);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);

        if (now.getHours < 12) {
          result.nextDate = now.getTime();
        }
        else {
          now.setTime (now.getTime() + (1000 * 60 * 60 * 24));
          result.nextDate = now.getTime();
        }

        await result.save();

        message.reply (`cut off set to <t:${Math.floor(now.getTime()/1000)}:R>\nKimo Active: false\n???: false`);

      } 

      if (command === 'forcerecheck') {

        console.log ('recheck requested by user');
        forceRecheck(client);

      } 

      if (command === 'sight') {
        // create button to give role power.
        console.log('createKimoDetected');

        const powerButton = new ButtonBuilder ()
        .setCustomId('allSeeingEyes')
        .setLabel('all seeing eyes')
        .setStyle(ButtonStyle.Danger);

        const powerRow = new ActionRowBuilder ()
        .addComponents(powerButton)

        message.channel.send ({content: 'See all channels within Kimo', components: [powerRow]});

      } 

      if (command === 'lifeguard') {
        // create button to give role power.
        console.log('createKimoDetected');

        const powerButton = new ButtonBuilder ()
        .setCustomId('lifeguardRole')
        .setLabel('get life guard role')
        .setStyle(ButtonStyle.Danger);

        const powerRow = new ActionRowBuilder ()
        .addComponents(powerButton)

        message.channel.send ({content: 'admin powers', components: [powerRow]});

      } 

      if (command === 'botlogger') {
        // create button to give role power.
        console.log('createKimoDetected');

        const powerButton = new ButtonBuilder ()
        .setCustomId('botlog')
        .setLabel('bot whisperer')
        .setStyle(ButtonStyle.Danger);

        const powerRow = new ActionRowBuilder ()
        .addComponents(powerButton)

        message.channel.send ({content: 'see bot logs', components: [powerRow]});

      } 

      if (command === 'npcbutton') {
        // create button to give role power.
        console.log('createKimoDetected');

        const powerButton = new ButtonBuilder ()
        .setCustomId('questNpcRole')
        .setLabel('get QUEST NPC ROLE')
        .setStyle(ButtonStyle.Danger);

        const powerRow = new ActionRowBuilder ()
        .addComponents(powerButton)

        message.channel.send ({content: 'see bot logs', components: [powerRow]});

      } 

      if (command === 'skiptutorial') {
        // create button to give role power.
        console.log('createKimoDetected');

        const powerButton = new ButtonBuilder ()
        .setCustomId('skiptutorial')
        .setLabel('SKIP TUTORIAL')
        .setStyle(ButtonStyle.Danger);

        const powerRow = new ActionRowBuilder ()
        .addComponents(powerButton)

        const embed = new EmbedBuilder()
        .setTitle("⁉ SKIP TUTORIAL")
        .setDescription("Having trouble completing the tutorial or using **/start?** PLEASE READ:\n```Kimodameshi is a draw everyday challenge for figure studies. It's Practice mode and invite week right now. People will die and be kicked if they forget to post in #post-daily.``` \nEVENT START: <t:1709294400:f>\n\nYou can skip the tutorial with this button but please use **/rules /figure /help** commands to learn more about the event later.\n\n_If you forget to post once the event starts, You will fail the challenge and be automatically **ejected** from the server._")
        .setFooter({
          text: "Click below to skip the tutorial and enter the main server:",
        });

        message.channel.send ({content: 'HELP:', embeds: [embed], components: [powerRow]});

      } 

    }
})

// regular hidden commands
client.on(Events.MessageCreate, async (message) => {

  if (message.guild.id != '1193663232041304134') return;

  if (message.content.startsWith('!')) {
      console.log('commandDetected');
      // Extract the command and any arguments
      const args = message.content.slice(1).trim().split(/ +/);
      const command = args.shift().toLowerCase();
  
      // Check the command and respond

      if (command === 'therapy') {

        const kimoServer =  await client.guilds.fetch('1193663232041304134');
        //await kimoServer.members.fetch();
        const therapyRole = kimoServer.roles.cache.get('1205106840061485089');
        const member = kimoServer.members.cache.get(message.member.user.id);

        if (member.roles.cache.has(therapyRole.id)) {
            member.roles.remove(therapyRole);
            return message.delete();
        }
        else {
            member.roles.add(therapyRole);
            return message.delete();
        }
      }

      if (command === 'stats') {

        const kimoServer =  await client.guilds.fetch('1193663232041304134');
        //await kimoServer.members.fetch();
        const therapyRole = kimoServer.roles.cache.get('1205115328246452244');
        const member = kimoServer.members.cache.get(message.member.user.id);

        if (member.roles.cache.has(therapyRole.id)) {
            member.roles.remove(therapyRole);
            return message.delete();
        }
        else {
            member.roles.add(therapyRole);
            return message.delete();
        }
      }

      if (command === 'panem') {

        const kimoServer =  await client.guilds.fetch('1193663232041304134');
        //await kimoServer.members.fetch();
        const therapyRole = kimoServer.roles.cache.get('1209350256115060766');
        const member = kimoServer.members.cache.get(message.member.user.id);

        if (member.roles.cache.has(therapyRole.id)) {
            member.roles.remove(therapyRole);
            return message.delete();
        }
        else {
            member.roles.add(therapyRole);
            return message.delete();
        }
      }

      if (command === 'memes') {

        const kimoServer =  await client.guilds.fetch('1193663232041304134');
        //await kimoServer.members.fetch();
        const therapyRole = kimoServer.roles.cache.get('1203621646611644476');
        const member = kimoServer.members.cache.get(message.member.user.id);

        if (member.roles.cache.has(therapyRole.id)) {
            member.roles.remove(therapyRole);
            return message.delete();
        }
        else {
            member.roles.add(therapyRole);
            return message.delete();
        }
      }

      if (command === 'backrooms') {

        const kimoServer =  await client.guilds.fetch('1193663232041304134');
        //await kimoServer.members.fetch();
        const therapyRole = kimoServer.roles.cache.get('1202553750523478036');
        const member = kimoServer.members.cache.get(message.member.user.id);

        if (member.roles.cache.has(therapyRole.id)) {
            member.roles.remove(therapyRole);
            return message.delete();
        }
        else {
            member.roles.add(therapyRole);
            return message.delete();
        }
      }

      if (command === 'cockcheck') {
        message.channel.send('https://cdn.discordapp.com/attachments/1200550297500659782/1209584155721990174/image.png?ex=65e77407&is=65d4ff07&hm=778093eb37e04e1daf4164b5dbbb0d8973969e24b0b08e47bdbb31e5e888558e&')
      }

      if (command === 'music') {

        const kimoServer =  await client.guilds.fetch('1193663232041304134');
        //await kimoServer.members.fetch();
        const therapyRole = kimoServer.roles.cache.get('1203621668719960114');
        const member = kimoServer.members.cache.get(message.member.user.id);

        if (member.roles.cache.has(therapyRole.id)) {
            member.roles.remove(therapyRole);
            return message.delete();
        }
        else {
            member.roles.add(therapyRole);
            return message.delete();
        }
      }

      if (command === 'alarm') {

        const kimoServer =  await client.guilds.fetch('1193663232041304134');
        //await kimoServer.members.fetch();
        const therapyRole = kimoServer.roles.cache.get('1209320167906087002');
        const member = kimoServer.members.cache.get(message.member.user.id);

        if (member.roles.cache.has(therapyRole.id)) {
            member.roles.remove(therapyRole);
            return message.delete();
        }
        else {
            member.roles.add(therapyRole);
            return message.delete();
        }
      }

      if (command === 'stocks') {

        const kimoServer =  await client.guilds.fetch('1193663232041304134');
        //await kimoServer.members.fetch();
        const therapyRole = kimoServer.roles.cache.get('1206930804387741776');
        const member = kimoServer.members.cache.get(message.member.user.id);

        if (member.roles.cache.has(therapyRole.id)) {
            member.roles.remove(therapyRole);
            return message.delete();
        }
        else {
            member.roles.add(therapyRole);
            return message.delete();
        }
      }

      if (command === 'dio.exe') {
        const dialogueArray = ['Where is my pen', 'WHERE IS MY PEN', 'Where art thou pen', 'URF URF URF'];
        const rIndex = Math.floor(Math.random() * dialogueArray.length);
        message.reply ({content: '``` dio: ' + dialogueArray[rIndex] + '```' });
      }

      if (command === 'andrew.exe') {

        const dialogueArray = ['florida', 'go gators', 'wanna play the finals?'];
        const rIndex = Math.floor(Math.random() * dialogueArray.length);

        message.reply ({content: '``` andrew: ' + dialogueArray[rIndex] + '```' });

      }

      if (command === 'figurehangout') {

        const kimoServer =  await client.guilds.fetch('1193663232041304134');
        //await kimoServer.members.fetch();
        const therapyRole = kimoServer.roles.cache.get('1205121471895048212');
        const member = kimoServer.members.cache.get(message.member.user.id);

        if (member.roles.cache.has(therapyRole.id)) {
            member.roles.remove(therapyRole);
            return message.reply ('figure draw together ping role removed!');
        }
        else {
            member.roles.add(therapyRole);
            return message.reply ('figure draw together ping role added!');
        }
      }
    }

    
})

// async function selfDeleteConfirmationMessage(message, content) {
//   const confirmationMessage = await message.reply('```' + content + '```');
//   setTimeout(() => {
//       confirmationMessage.delete();
//   }, 3 * 1000);
//   message.delete();
// }

// Define a collection to store your commands
client.commands = new Map();

// Read the command files and register them
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
  }
});

// Log in to Discord with your client's token

client.login(token);