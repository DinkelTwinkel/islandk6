const UserData = require('../models/userData');
const fs = require('fs');
const UserState = require('../models/userState');

module.exports = async (client, channel) => {

    // output the staff
    // output the each user currently not dead, their Name and Social Link and Final SeaShells.

    const allStates = await UserState.find();

    const allSAFE = await UserState.find({currentState: 'SAFE'});
    const allDANGER = await UserState.find({currentState: 'DANGER'});
    const totalFinalSurivorCount = Array.from(allSAFE).length + Array.from(allDANGER).length;

    let finalString = 'KIMO CLOSED BETA FINAL SURVIVOR LIST\n' + `TOTAL SURVIVORS: ${totalFinalSurivorCount}\n`;

    let count = 0;
    const statesArray = Array.from(allStates);

    for (let index = 0; index < Array.from(allStates).length; index++) {

        console.log (statesArray[index]);

        if (statesArray[index].currentState != 'DEAD') {

            const data = await UserData.findOne({userID: statesArray[index].userID});
      
            let kimoGrade = 'FFF';
        
            if (data.kimoScore > 1000) {
                kimoGrade = 'EEE'
            }
            if (data.kimoScore > 3000) {
                kimoGrade = 'DDD'
            }
            if (data.kimoScore > 5000) {
                kimoGrade = 'CCC'
            }
            if (data.kimoScore > 7000) {
                kimoGrade = 'BBB'
            }
            if (data.kimoScore > 10000) {
                kimoGrade = 'AAA'
            }
            if (data.kimoScore > 15000) {
                kimoGrade = 'SSS'
            }
            if (data.kimoScore > 20000) {
                kimoGrade = 'SSSSS'
            }
            if (data.kimoScore > 30000) {
                kimoGrade = 'EXXXXXX'
            }
            
            finalString = finalString.concat('=====================\n');
            finalString = finalString.concat(`${data.name} [GRADE: ${kimoGrade}+]\n`);
            finalString = finalString.concat(`${data.money} Seashells Collected\n`);
            finalString = finalString.concat(`${data.socialLink}\n`);
            finalString = finalString.concat('=====================\n');
        }
        
    }

    fs.writeFileSync('output.txt', finalString);

    channel.send({ files: ['output.txt']});

};
