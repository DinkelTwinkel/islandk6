const UserState = require('../models/userState');

module.exports = async (member) => {

    const safeRole = member.guild.roles.cache.get('1193249042696777869');
    const dangerRole = member.guild.roles.cache.get('1193249077442383964');
    const deadRole = member.guild.roles.cache.get('1193249094014083083');

    const result = await UserState.findOne({ userID: member.user.id });

    if (result) {

        if (member.user.bot) return;

        if (member.user.id === member.guild.ownerId) {
            if (result.currentState === 'SAFE') {
                member.roles.add(safeRole);
                member.roles.remove(dangerRole);
                member.roles.remove(deadRole);
            }
            else if (result.currentState === 'DANGER') {
                member.roles.remove(safeRole);
                member.roles.add(dangerRole);
                member.roles.remove(deadRole);
            }
            else if (result.currentState === 'DEAD') {
                member.roles.remove(safeRole);
                member.roles.remove(dangerRole);
                member.roles.add(deadRole);
            }
            return
        };

        if (result.currentState === 'SAFE') {
            member.roles.set([safeRole]);
        }
        else if (result.currentState === 'DANGER') {
            member.roles.set([dangerRole]);
        }
        else if (result.currentState === 'DEAD') {
            member.roles.set([deadRole]);
        }
        else {
        // invalid state detected.    
        }

    }
    else {
        const newUserDoc = new UserState ({
            userID: member.user.id,
            currentState: 'DANGER',
            lastPostTime: 0,
            streak: 0,
            postedToday: false,
        })
    await newUserDoc.save();
    member.roles.set([dangerRole]);
   }

};