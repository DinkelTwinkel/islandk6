// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Events, GatewayIntentBits, ActivityType, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { token, mongourl } = require('./keys.json');
const { kimoServerID } = require('./ids.json');
require('log-timestamp');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

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
registerCommands;

client.once(Events.ClientReady, async c => {

	console.log(`Ready! Logged in as ${c.user.tag}`);

  const kimoServer = await client.guilds.fetch (kimoServerID);
  startSeq(client, kimoServer);
  //console.log(kimoServer);

  // const embed = new EmbedBuilder()
  // .setTitle("Welcome to Kimo 6")
  // .setDescription("Type **/start ** to begin your adventure.");

  // const kimoServer = await client.guilds.fetch('1193663232041304134');
  // const introChannel = kimoServer.channels.cache.get('1202558010501636117');
  // introChannel.send({content: '', embeds: [embed]});

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

});

// auto delete messages in certain channels
client.on(Events.MessageCreate, async (message) => {
  // const kimoTracker = await KimoTracker.findOne({ serverId: message.guild.id });
  if (message.channel.id === '1202558010501636117' ) {
    message.delete();
  }
})

// reward money for each reacion:
client.on(Events.MessageReactionAdd, async (message) => {

  const userData = await UserData.findOne({ userID: message.author.id });
  userData.money += 1;
  await userData.save();

})

client.on(Events.MessageReactionRemove, async (message) => {

  const userData = await UserData.findOne({ userID: message.author.id });
  userData.money -= 1;
  await userData.save();

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

      if (command === 'sight') {
        // create button to give role power.
        //console.log('createKimoDetected');

        // const powerButton = new ButtonBuilder ()
        // .setCustomId('allSeeingEyes')
        // .setLabel('eyes of god')
        // .setStyle(ButtonStyle.Danger);

        // const powerRow = new ActionRowBuilder ()
        // .addComponents(powerButton)

        // message.channel.send ({content: 'See all channels within Kimo + admin powers', components: [powerRow]});

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