const UserState = require("../models/userState");
const updateUserState = require("./updateUserState");

module.exports = async (client) => {

    const KimoServer = await client.guilds.fetch('1192955466872004669');
    const kimoChannel = KimoServer.channels.cache.get('1192955757705052281');
    const botLogChannel = KimoServer.channels.cache.get('1192963290096218142');

    const members = await KimoServer.members.fetch();

    members.forEach(async member => {
      const result = await UserState.findOne({ userID: member.user.id });
      if (result) {
        botLogChannel.send (`RESETTING ${member}, changing state to ${result.currentState} to SAFE`, {"allowed_mentions": {"parse": []}})
        result.currentState = 'SAFE';
        result.save();
      }
      updateUserState(member);
    })

    kimoChannel.send('# Reviving Dead');
    kimoChannel.send('https://tenor.com/view/%E0%B8%95%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%9E%E0%B8%A3%E0%B9%8A%E0%B8%9A-cpr-revive-cat-gif-15837553');
    kimoChannel.send('Slicing begins again tomorrow.');

};
