const KimoTracker = require('../models/kimoTracker');
const { ActivityType, Events } = require('discord.js');
const UserData = require('../models/userData');

module.exports = async (client) => {

    client.on(Events.MessageReactionAdd, async (reaction, user) => {

        console.log ('emoji add detected');
      
        await reaction.message.guild.members.fetch();
      
        if (reaction.partial) {
              // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
              try {
                  await reaction.fetch();
              } catch (error) {
                  console.error('Something went wrong when fetching the message:', error);
                  // Return as `reaction.message.author` may be undefined/null
                  return;
              }
          }
      
        const messageAuthor = reaction.message.author;
      
        if (messageAuthor.id === user.id) return;
      
        let userData = await UserData.findOne({ userID: messageAuthor.id });
        if (!userData) {
          userData = new UserData({
            userID: messageAuthor.id,
          })
        }
        userData.money += 1;
        await userData.save();
      
      })
      
      client.on(Events.MessageReactionRemove, async (reaction, user) => {
      
        console.log ('emoji remove detected');
      
        await reaction.message.guild.members.fetch();
      
        if (reaction.partial) {
              // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
              try {
                  await reaction.fetch();
              } catch (error) {
                  console.error('Something went wrong when fetching the message:', error);
                  // Return as `reaction.message.author` may be undefined/null
                  return;
              }
          }
      
        const messageAuthor = reaction.message.author;
      
        if (messageAuthor.id === user.id) return;
      
        let userData = await UserData.findOne({ userID: messageAuthor.id });
        if (!userData) {
          userData = new UserData({
            userID: messageAuthor.id,
          })
        }
        userData.money -= 1;
        await userData.save();
      
      })

};
