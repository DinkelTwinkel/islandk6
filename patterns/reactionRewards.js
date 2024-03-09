const KimoTracker = require('../models/kimoTracker');
const { ActivityType, Events } = require('discord.js');
const UserData = require('../models/userData');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const ReactionLimit = require('../models/reactionRewardTracker');

module.exports = async (client) => {

        client.on(Events.MessageReactionAdd, async (reaction, user) => {

        console.log ('emoji add detected');
      
        reaction.message.guild.members.fetch();
      
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

        if (reaction.emoji.name === '❌') return;
      
        const messageAuthor = reaction.message.author;
      
        if (messageAuthor.id === user.id) return;
        
        const result = await ReactionLimit.findOne({
          messageId: reaction.message.id,
          reactorId: user.id,
        })

        console.log (user);

        if (result) return console.log ('already reacted to this post before, reward cancelled.');

        const newReactionTracker = new ReactionLimit ({
          messageId: reaction.message.id,
          reactorId: user.id,
        })

        await newReactionTracker.save();
      
        let userData = await UserData.findOne({ userID: messageAuthor.id });
        if (!userData) {
          userData = new UserData({
            userID: messageAuthor.id,
          })
        }

        console.log ('Not reacted to this post before, reward gained');
        userData.money += 1;
        await userData.save();
      
      })
      
      client.on(Events.MessageReactionRemove, async (reaction, user) => {
      
        console.log ('emoji remove detected');
      
        reaction.message.guild.members.fetch();
      
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
