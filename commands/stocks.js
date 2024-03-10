const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Stock = require('../models/stock');
const Inventory = require('../models/inventory');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stocks')
    .setDescription('get rich quick'),

    async execute(interaction, client) {

      if (!interaction.member.roles.cache.get('1206930804387741776')) return interaction.reply ({content: `What stocks? We don't have that here...`, ephemeral: true});

      // generate button row.

      const stocks = await Stock.find();
      
      const playerInventory = await Inventory.find({ ownerId: interaction.member.user.id });

      const actionRowArray = [];

      console.log (stocks);

      stocks.forEach(async stock => {

        // console.log ('creating stock' + stock.stockName);

        const stockNameButton = new ButtonBuilder ()
          .setCustomId('Fake' + stock.stockName)
          .setDisabled(true)
          .setStyle(ButtonStyle.Primary)
          .setLabel(stock.stockName);

        const stockValueButton = new ButtonBuilder ()
          .setCustomId('Fake' + stock.stockName + stock.currentValue)
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary)
          .setLabel(`Share Price: ${stock.currentValue} Shells`);

        const stockBuyButton = new ButtonBuilder ()
          .setCustomId('buy' + stock.stockName)
          .setDisabled(false)
          .setStyle(ButtonStyle.Secondary)
          .setLabel('BUY');

        let currentlyHave = 0;
        let profit = 0;

        if (playerInventory) {
          const itemCheck = playerInventory.find(playerInventory => playerInventory.itemName === stock.stockName)
          
          if (itemCheck) {
            profit = itemCheck.totalSpent - (stock.currentValue * itemCheck.Inventory);
            currentlyHave = itemCheck.quantity;
          }
        }


        const stockSellButton = new ButtonBuilder ()
          .setCustomId('sell' + stock.stockName)
          .setDisabled(false)
          .setStyle(ButtonStyle.Secondary)
          .setLabel(`SELL: [${currentlyHave}]`);

        const stockRisingButton = new ButtonBuilder ()
          .setCustomId('Fake' + stock.stockName + 'Rising')
          .setDisabled(true)
          .setStyle(ButtonStyle.Success)
          .setLabel(`PROFIT: ${profit}`);


        if (profit < 0) {
          //stockRisingButton.setLabel(`-${stock.currentShift}%↘`)
          stockRisingButton.setStyle(ButtonStyle.Danger);
        }
        
        const newActionRow = new ActionRowBuilder ()
        .addComponents( stockNameButton, stockValueButton, stockBuyButton, stockSellButton, stockRisingButton);

        actionRowArray.push(newActionRow);

      });


      let username = interaction.member.nickname;
      if (!interaction.member.nickname) username = interaction.member.user.globalName;

      interaction.reply ({ content: 'Rule one of stock market: There is no stock market. Every sell trade costs 1 shell to facilitate.', components: actionRowArray , ephemeral: true })

    },
  };

