module.exports = async (spaceSeparatedString, cut) => {

  const splitEmojis = (sushi) => [...new Intl.Segmenter().segment(sushi)].map(x => x.segment);
  //const sushi = splitEmojis("🌊🌊🦈🚢🌊🌊🌊🌊🌊🌊🌊🚢🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🐟🚁⛵🚤🐬🐳🐋🐟🐠🐡🦐🦑🐙🦞🦀🐚")
  const sushi = splitEmojis("👁👁👁👁👁👁👁👁👁👁👁👁👁🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸🩸👁👁👁👁👁👁🩸✂✂✂✂")
  const randomIndex = Math.floor(Math.random() * sushi.length);

  const string = spaceSeparatedString.split(' ');

  if (string.length > 1) {
    let newString = await string[1].concat(sushi[randomIndex]);

    newString = newString.substring(1);

    console.log (string);
    console.log (newString);
    //console.log (sushiArray);

    return string[0] + ' ' + newString;
  }

  else {
    let newString = await spaceSeparatedString.concat(sushi[randomIndex]);

    newString = newString.substring(1);

    console.log (string);
    console.log (newString);
    //console.log (sushiArray);

    return newString;
  }
};