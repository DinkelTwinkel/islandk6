const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserData = require('../models/userData');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('who has the most VBUCKS?'),

    async execute(interaction, client) {

      await interaction.deferReply({ephemeral: true});

      const players = await UserData.find().sort({ money: -1 });
      const firstPlace = await client.guilds.cache.get('1193663232041304134').members.fetch(players[0].userID);

      let firstPlaceName = firstPlace.nickname;
      if (!firstPlace.nickname) 
      firstPlaceName = firstPlace.user.username;

      const embed = new EmbedBuilder()
      .setTitle(' LEADERBOARD: TOP 25 ')
      .setDescription(`# 👑『 FIRST PLACE 』 ${firstPlaceName}\n  # ▬▶ ${players[0].money} Seashells\n ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡ ⟡`)
      .setThumbnail(firstPlace.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
      .setColor("#f5f3b8")

      for (let index = 1; index < 25; index++) {

        // console.log(players[index])

        const player = await client.guilds.cache.get('1193663232041304134').members.fetch(players[index].userID);

          let username = player.nickname;
          if (!player.nickname) 
          username = player.user.username;
  
          embed.addFields({
            name: `『${index + 1}』${username}`,
            value: `-▶ ${players[index].money.toString()} shells`,
            inline: true
          })
  

        // console.log(player)
        
      }

      
    interaction.followUp({ embeds: [embed] });
    

    },
  };
