const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserData = require('../models/userData');
const UserStats = require('../models/userStatistics');
const { kimoServerID, announcementChannelID, jailedRoleID, dangerRoleID } = require('../ids.json');
const UserState = require('../models/userState');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('who talks the most'),

    async execute(interaction, client) {

      if (!interaction.member.roles.cache.get('1203377553763475497')) return interaction.reply({ content: 'Only npcs can use this...', ephemeral: true });

      await interaction.deferReply();

      const players = await UserData.find().sort({ money: -1 });
      const firstPlace = await client.guilds.cache.get('1193663232041304134').members.fetch(players[0].userID);
      const KimoServer = await client.guilds.fetch (kimoServerID);

      let firstPlaceName = firstPlace.nickname;
      if (!firstPlace.nickname) 
      firstPlaceName = firstPlace.user.username;

      const allUserStats = await UserStats.find({});
      let allUserStatsFiltered = [];
      const teamDatas = await UserData.find({});
      const allUserStates = await UserState.find({})

      KimoServer.members.fetch();

      console.log (allUserStats.size);
  
      const userStatArray = Array.from(teamDatas);
  
      let money = 0;
      let islandACount = 0;
      let islandATotal = 0;
      let islandBCount = 0;
      let islandBTotal = 0;
      let totalCount = 0;

      // Sorting the collection by the 'money' property into a new array

  
      for (let index = 0; index < userStatArray.length; index++) {

        const member = KimoServer.members.cache.get(userStatArray[index].userID);

        if (!member) continue;
        if (member.user.bot) continue;
        if (member.roles.cache.get('1202555128352346143')) continue;
        // money += userStatArray[index].money;
        console.log (money);

        // const teamData = teamDatas.filter(data => data.userID === userStatArray[index].userID );
        // //console.log(teamData)
        // if (!teamData) continue;

        // const userState = allUserStates.filter(data => data.userID === userStatArray[index].userID && data.currentState != 'DEAD' );
        // //console.log (userState);
        // if (!userState) continue;

        if (member.roles.cache.get('1202551817708507136')) {
          money += userStatArray[index].money;
          totalCount += 1;
          islandACount += 1;
          islandATotal += userStatArray[index].money;
          allUserStatsFiltered.push(userStatArray[index]);
        }
        else 
        if (member.roles.cache.get('1202876101005803531')) {
          money += userStatArray[index].money;
          totalCount += 1;
          islandBCount += 1;
          islandBTotal += userStatArray[index].money;
          allUserStatsFiltered.push(userStatArray[index]);
        }
        

      }

      const sortedArray = sortBymoney(allUserStatsFiltered);
  
      const averageMessage = money / totalCount;
      const averageA = islandATotal / islandACount;
      const averageB = islandBTotal / islandBCount;
      console.log (`Average Message Per User = ${Math.floor(averageMessage)}`);

      const embed = new EmbedBuilder()
      .setTitle(' LEADERBOARD: TOP 25 SHELLS ')
      .setDescription(`# 👑『 FIRST PLACE 』 ${firstPlaceName}\n  # ▬▶ ${players[0].money} SHELLS\n ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡`)
      .setThumbnail(firstPlace.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .setColor("#f5f3b8")
      .setFooter({
        text: `Global Stats (Not including bots, not including moderators, not including dead participants, not counting Dailies) \nAverage per user: ${Math.floor(averageMessage)} (${money}/${totalCount}) \nTotal Shells: ${money} \nAverage per 🍉: ${Math.floor(averageA)} (${islandATotal}/${islandACount})\nAverage per 🍑: ${Math.floor(averageB)} (${islandBTotal}/${islandBCount})\nTop 10% Average: ${findPercentileAverage(sortedArray, 0.1)}\nTop 5% Average: ${findPercentileAverage(sortedArray, 0.05)}\nTop 1% Average: ${findPercentileAverage(sortedArray, 0.01)}\nLower 60% Average: ${findLowerPercentileAverage(allUserStatsFiltered, 0.4)}\nLower 80% Average: ${findLowerPercentileAverage(allUserStatsFiltered, 0.2)}\nLower 90% Average: ${findLowerPercentileAverage(allUserStatsFiltered, 0.1)}\nLower 95% Average: ${findLowerPercentileAverage(allUserStatsFiltered, 0.05)}\nLower 99% Average: ${findLowerPercentileAverage(allUserStatsFiltered, 0.01)}`,
      });

      for (let index = 1; index < 25; index++) {

        // console.log(players[index])
        try {

        //const player = await client.guilds.cache.get('1193663232041304134').members.fetch(players[index].userID);

          // let username = player.nickname;
          // if (!player.nickname) username = player.user.username;
  
          embed.addFields({
            name: `\'`,
            value: `『${index + 1}』<@${players[index].userID}>\n-▶ ${players[index].money.toString()} SHELLS`,
            inline: true
          })
  
        }
        catch (err) {
          console.log (err)
        }
        // console.log(player)
        
      }

      
    await interaction.editReply({ embeds: [embed] });

    },
};


function findPercentileAverage(array, percentile) {
  // Sort the array in descending order
  const sortedArray = array.sort((a, b) => b - a);
  
  // Determine the index where the top 10% elements start
  const startIndex = Math.ceil(array.length * percentile);
  
  // Slice the array from the beginning up to that index
  const top10Percent = sortedArray.slice(0, startIndex);

  let tenPercentTotal = 0;
  for (let index = 0; index < top10Percent.length; index++) {
    tenPercentTotal +=  top10Percent[index].money;
  }

  const PercentileAverage = tenPercentTotal/top10Percent.length;
  
  return Math.floor(PercentileAverage);
}

function findLowerPercentileAverage(array, percentile) {

  console.log (array.length);
  // Sort the array in descending order
  const sortedArray = array.sort((a, b) => a - b);
  
  // Determine the index where the lower 90% elements end
  const endIndex = Math.ceil(array.length * percentile);
  
  // Slice the array from that index to the end
  const lower90Percent = sortedArray.slice(endIndex);

  let tenPercentTotal = 0;

  for (let index = 0; index < lower90Percent.length; index++) {
    tenPercentTotal +=  lower90Percent[index].money;
  }

  console.log (lower90Percent.length);
  console.log (tenPercentTotal);

  const PercentileAverage = tenPercentTotal/lower90Percent.length;
  
  return Math.floor(PercentileAverage);
}

// Function to sort the collection by money into an array
function sortBymoney(collection) {
  // Sort the collection by the 'money' property
  const sortedCollection = collection.sort((a, b) => {
      return b.money - a.money; // Sort in descending order
  });
  
  return sortedCollection;
}