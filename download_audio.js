const axios = require('axios').default;
const fs = require('fs');

async function downloadAudio(text) {
  let resp = await axios.post('https://api.soundoftext.com/sounds', {
    engine: "Google",
    data: {
      text,
      voice: "en-US"
    }
  });

  if (!resp.data.success) {
    console.error('Failed at step 1');
    return -1;
  }

  resp = await axios.get('https://api.soundoftext.com/sounds/' + resp.data.id);

  if (resp.data.status !== 'Done') {
    console.error('Failed at step 2');
    return -2;
  }

  console.log(`Start download audio of "${text}" from ${resp.data.location}`);
  
  resp = await axios.get(resp.data.location, {
    responseType: 'stream'
  });
  resp.data.pipe(fs.createWriteStream('./audios/' + text + '.mp3'));

  console.log(`Download audio: "${text}" success`);
  return 0;
}

module.exports = downloadAudio;

// if (process.argv.length > 2) {
//   downloadAudio(process.argv[2]);
// }