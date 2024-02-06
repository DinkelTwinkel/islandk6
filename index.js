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
registerCommands;

client.once(Events.ClientReady, async c => {

	console.log(`Ready! Logged in as ${c.user.tag}`);

  const kimoServer = await client.guilds.fetch (kimoServerID);
  const botLogChannel = kimoServer.channels.cache.get(botLogChannelID);
  botLogChannel.send (`# I've awoken.`);

  startSeq(client, kimoServer);
  cutOffClock(client);
  dailySLICE(client);
  radio(client);
  rulesButtonListeners(client);
  jailAuto(client);
  postDailyTasker(client);
  DangerRoleColourShifting(client);

  setInterval(() => {

    dailySLICE(client);
    
  }, 1000 * 10);

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

  // const refChannel1 = kimoServer.channels.cache.get('1202622867863506945');
  // const refChannel2 = kimoServer.channels.cache.get('1202877025032081438');

  // const guidelineEmbed = new EmbedBuilder()
  // .setAuthor({
  //   name: "REF BOOK GUIDELINES",
  // })
  // .setDescription("use /shareref to add images to this channel.\nCredit the creator directly: do not use repost links such as from pinterest. Thank you!");

  // refChannel1.send({embeds: [guidelineEmbed]})
  // refChannel2.send({embeds: [guidelineEmbed]});

});

// new user join auto role
client.on(Events.GuildMemberAdd, async (member) => {
  // updateUserState(member);
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

})

//JASON ONLY Secret Commands 
//Check if user is also in the hell mart discord. Only work if so.
client.on(Events.MessageCreate, async (message) => {

  if (message.member.user.id != '865147754358767627') return;

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

    }
})

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