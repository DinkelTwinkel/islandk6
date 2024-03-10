const { Events, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const Stock = require("../models/stock");
const Inventory = require("../models/inventory");
const getAllMessagesInChannel = require("./getAllMessagesInChannel");
const UserData = require("../models/userData");

const stockFluctuationTimer = 720;

module.exports = async (client) => {

  // stockName: { type: String, required: true, unique: true },
	// currentValue: { type: Number, required: true },
	// passiveFluctuation: { type: Number, required: true },
	// onePercentChanceFluctuation: { type: Number, required: true },
	// rising: { type: Boolean, required: true, default: true },
	// currentShift: { type: Number, required: true, default: 0 },

  // const newStock = new Stock ({
  //   stockName: 'DrawingFeet',
  //   currentValue: 5,
  //   passiveFluctuation: 1,
  //   onePercentChanceFluctuation: 10,
  //   rising: true,
  //   currentShift: 0,
  // })

  // newStock.save();

  client.on(Events.MessageCreate, async (message) => {

    console.log ('new message detected');

    if (message.member.user.bot) return;

    if (message.channel.id != '1206930735315943444') return;

    createStockMarket(client);

  });

  console.log ('StockMarket Module Engaged');

  // shiftStock (client);

  const allStocks = await Stock.find({});

  allStocks.forEach(async stock => {
    
    const now = new Date().getTime();
    
    if (now > stock.nextUpdateTime) {

      shiftStock(client);
      stock.nextUpdateTime = now + (60 * 1000 * 60 * 12 * Math.random()) ;
      await stock.save();

    }

  });

  setTimeout(() => {
    createStockMarket(client);
  }, 1000 * 5);


  setInterval(async () => {

    const allStocks = await Stock.find({});

    allStocks.forEach(async stock => {
      
      const now = new Date().getTime();
      
      if (now > stock.nextUpdateTime) {
  
        shiftStock(client);
        stock.nextUpdateTime = now + (60 * 1000 * 60 * 12 * Math.random()) ;
        await stock.save();
        
        setTimeout(() => {
          createStockMarket(client);
        }, 1000 * 5);

      }
  
    });

    const allInventories = await Inventory.find({});

    allInventories.forEach(async checkStock => {

      const findStock = await Stock.findOne({stockName: checkStock.itemName });
      if (!findStock) {
        console.log (checkStock.itemName + ' NOT FOUND');
        checkStock.quantity = 0;
        await checkStock.save();
      }
      
    });


  }, 1000 * 10 );



  client.on(Events.InteractionCreate, async (interaction) => {

    kimoServer = await client.guilds.fetch('1193663232041304134');
    const refChannel1 = kimoServer.channels.cache.get('1206930735315943444');

    if (interaction.isButton === false) return;

    const stocks = await Stock.find();

    stocks.forEach ( async stock => {

      if (interaction.customId === 'buy' + stock.stockName) {

        //interaction.deferUpdate();
        // buy click deteced.

        const cost = stock.currentValue;
        const checkPouch = await UserData.findOne ({userID: interaction.member.user.id});
        if (checkPouch.money < cost) return interaction.reply ({content: `You do not have enough shells! You need ${cost} shells to perform this action!`, ephemeral: true });
        checkPouch.money -= cost;
        await checkPouch.save();

        // successfully bought.

        let checkExistingInventory = await Inventory.findOne({
          ownerId: interaction.member.user.id,
          itemName: stock.stockName,
        })

        if (!checkExistingInventory) {
          // no existing inventory item, creating new
          checkExistingInventory = new Inventory ({
            ownerId: interaction.member.user.id,
            itemName: stock.stockName,
            quantity: 0,
          })
        }

        checkExistingInventory.quantity += 1;

        // console.log (checkExistingInventory);

        await checkExistingInventory.save();

        if (interaction.channel.id === '1206930735315943444') {
          interaction.deferUpdate();
        }
        else {
          interaction.reply({content: `You bought ${stock.stockName} stock for ${stock.currentValue}, you currently have ${checkExistingInventory.quantity} shares.`, ephemeral: true});
        }

        //refChannel1.send (`${interaction.member.displayName} bought ${stock.stockName} stock for ${stock.currentValue} sea shells, they currently have ${checkExistingInventory.quantity} shares.`);
        refChannel1.send (`Someone bought ${stock.stockName}!`);
        
        if (Math.random() > 0.5) {
          stock.currentValue += 1;
          refChannel1.send (`${stock.stockName} increased to ${stock.currentValue} seashells!`);
        }

        await stock.save();


        createStockMarket(client);
      }
      else if (interaction.customId === 'sell' + stock.stockName) {


        let checkExistingInventory = await Inventory.findOne({
          ownerId: interaction.member.user.id,
          itemName: stock.stockName,
        })

        if (!checkExistingInventory || checkExistingInventory.quantity === 0) return interaction.reply({content: 'You must buy the stock first!', ephemeral: true });
        
        // user posesses stock

        checkExistingInventory.quantity -= 1;
        await checkExistingInventory.save();

        const checkPouch = await UserData.findOne ({userID: interaction.member.id});
        checkPouch.money += stock.currentValue-1;
        await checkPouch.save();



        if (interaction.channel.id === '1206930735315943444') {
          interaction.deferUpdate();
        }
        else {
          interaction.reply({content: `You sold ${stock.stockName} Stock for ${stock.currentValue} shells and paid 1 shell in transaction fee, you currently have ${checkExistingInventory.quantity} shares.`, ephemeral: true});
        }

        const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
        jianDaoWallet.money += 1;
        await jianDaoWallet.save();

        //refChannel1.send (`${interaction.member.displayName} sold ${stock.stockName} Stock for ${stock.currentValue} sea shells and paid 1 shell in transaction fee, they currently have ${checkExistingInventory.quantity} shares.`);
        refChannel1.send (`Someone sold ${stock.stockName}!`);

        if (Math.random() > 0.4) {
          stock.currentValue -= 1;
          refChannel1.send (`${stock.stockName} decreased to ${stock.currentValue} seashells...`);
        }
        await stock.save();

        createStockMarket(client);
      }

    })
  
  });

};

async function shiftStock (client) {

  let stocks = await Stock.find();
  stocks.forEach (async stock => {

    const oldPrice = stock.currentValue;

    if (0.1 > Math.random()) {
      stock.rising = !stock.rising;
    }
    
    const rising = stock.rising;
    
    let change = stock.passiveFluctuation;

    if (0.01 > Math.random() || (0.1 > Math.random() && rising === false)) {
      change = stock.onePercentChanceFluctuation;
      if (stock.onePercentChanceFluctuation < 0) stock.rising = false;
    }

    if (rising === false) {
      const stockKiller = Math.ceil(passiveFluctuation * Math.random());
      change += stockKiller;
    }

    change = Math.ceil(change * Math.random());

    stock.currentShift = Math.round((change / stock.currentValue) * 100) / 100;

    if (rising === true) {
      stock.currentValue += change;
      await client.guilds.cache.get('1193663232041304134').channels.cache.get('1206930735315943444').send('**' + stock.stockName + ` Increased from ${oldPrice} to ${stock.currentValue}**`);
      if (stock.currentValue < 1) stock.currentValue = 1;
    }
    else {
      stock.currentValue -= change;
      await client.guilds.cache.get('1193663232041304134').channels.cache.get('1206930735315943444').send('**' + stock.stockName + ` Decreased from ${oldPrice} to ${stock.currentValue}**`);
      if (stock.currentValue < 1) {
        //stock death
        console.log (stock.stockName + ' has died, generating new stock');

        await Inventory.deleteMany({itemName: stock.name});
        await client.guilds.cache.get('1193663232041304134').channels.cache.get('1206930735315943444').send('# ' + stock.stockName + ' has gone bankrupt! new stock available.');

        // replace stock with new stock. 

        // pick random stock name.
        // stock = ({
        //   stockName: await getStockName(client),
        //   currentValue: Math.ceil(Math.random() * 100),
        //   passiveFluctuation: Math.ceil(Math.random() * 100),
        //   onePercentChanceFluctuation: Math.ceil(Math.random() * 1000),
        // })

        stock.stockName = await getStockName(client);

        let stockCheckName = await Stock.findOne({ stockName: stock.stockName })

        while (stockCheckName) {
          stock.stockName = await getStockName(client);
          stockCheckName = await Stock.findOne({ stockName: stock.stockName });
          console.log ('whileLoop');
        }

        stock.currentValue = Math.ceil(Math.random() * 100 + 5);
        stock.passiveFluctuation = Math.ceil(Math.random() * 30);
        stock.onePercentChanceFluctuation = Math.ceil(Math.random() * 100);
        stock.currentShift = 0;
        stock.rising = false;

        if (Math.random() < 0.2) stock.onePercentChanceFluctuation = stock.onePercentChanceFluctuation * -1;

      }
    }

    await stock.save();
    return;

  })
}

async function getStockName(client) {

  const backRooms = await client.guilds.cache.get('1063167135939039262');
  const cookieChannel = await backRooms.channels.cache.get('1206589106751148092');

  const messages = await getAllMessagesInChannel(cookieChannel);

  const randomIndex = Math.floor(Math.random() * messages.length);

  const randomMessage = Array.from(messages)[randomIndex];

  return randomMessage.content;

}

async function createStockMarket(client) {

        kimoServer = await client.guilds.fetch('1193663232041304134');

        const refChannel1 = kimoServer.channels.cache.get('1206930735315943444');
        const messages = await refChannel1.messages.fetch();
        messages.forEach(message => {
          if (message.content === '**KIMO STOCK MARKET**') {
            try {
              message.delete();
            }
            catch (err) {
              console.log (err);
            }
          }
        });
        // generate button row.

        const stocks = await Stock.find();
      
        //const playerInventory = await Inventory.find({ ownerId: interaction.member.user.id });
  
        const actionRowArray = [];
  
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
  
          // if (playerInventory) {
          //   const itemCheck = playerInventory.find(playerInventory => playerInventory.itemName === stock.stockName)
          //   if (itemCheck) {
          //     currentlyHave = itemCheck.quantity;
          //   }
          // }
  
          const stockSellButton = new ButtonBuilder ()
            .setCustomId('sell' + stock.stockName)
            .setDisabled(false)
            .setStyle(ButtonStyle.Secondary)
            .setLabel(`SELL`);
//           .setLabel(`SELL: [${currentlyHave}]`);
  
          const stockRisingButton = new ButtonBuilder ()
            .setCustomId('Fake' + stock.stockName + 'Rising')
            .setDisabled(true)
            .setStyle(ButtonStyle.Success)
            .setLabel(`+${stock.currentShift}%↗`);
  
  
          if (stock.rising === false) {
            stockRisingButton.setLabel(`${stock.currentShift}%↘`)
            stockRisingButton.setStyle(ButtonStyle.Danger);
          }
          
          const newActionRow = new ActionRowBuilder ()
          .addComponents( stockNameButton, stockValueButton, stockBuyButton, stockSellButton, stockRisingButton);
  
          actionRowArray.push(newActionRow);
  
        });

        const embed = new EmbedBuilder()
        .setDescription(`use /stocks to see your current portfolio. \n Prices shift randomly now cuz you guys asked for it. Every sell trade costs 1 shell to facilitate.`
        );
  
        refChannel1.send ({ content: '**KIMO STOCK MARKET**', components: actionRowArray , ephemeral: false, embeds: [embed] })

}