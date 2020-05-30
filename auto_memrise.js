const pptr = require('puppeteer');
const downloadAudio = require('./download_audio');
const config = require('./config.json');

(async () => {
  const input = require(process.argv[2]);
  console.log('Input', input);

  const browser = await pptr.launch({
    headless: false,
    args: [
      '--start-maximized'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  console.log('Start login...');
  await page.goto('https://www.memrise.com/login/');
  await page.type('input[data-testid="loginUsernameInput"]', config.username);
  await page.type('input[data-testid="loginPasswordInput"]', config.password);
  await page.click('input[data-testid="loginFormSubmit"]');
  await page.waitForNavigation();
  console.log(`Login as "${config.username}" success`);

  await page.goto(input.levelUrl); // edit here
  await page.click('.infos a.edit-button');
  
  const { words } = input;
  for (const word of words) {
    console.log(`Start input "${word.en}"...`);
    await page.waitForSelector('tr[data-role="add-form"] td.text[data-key="1"]');
    await page.type('tr[data-role="add-form"] td.text[data-key="1"] input', word.en);
    await page.type('tr[data-role="add-form"] td.text[data-key="2"] input', word.vi);
    await page.keyboard.press('Enter');
    await page.click('tr[data-role="add-form"] i.ico-plus');
    await page.waitForResponse('https://www.memrise.com/ajax/level/thing/add/', { timeout: 30000 });
    await page.waitFor(500);
    console.log(`Input word "${word.en}" done`);
    
    let error = await downloadAudio(word.en);
    if (error !== 0) return;

    const uploadBtn = await page.$('.things .thing:last-child input[type="file"]');
    await uploadBtn.uploadFile(`./audios/${word.en}.mp3`);
    await page.waitForResponse('https://www.memrise.com/ajax/thing/cell/upload_file/', { timeout: 30000 });
    await page.reload();
    console.log(`Add audio of word "${word.en}" done`);
  }

  console.log('Done!!!');
})();