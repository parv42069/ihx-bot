import puppeteer from 'puppeteer';

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const claimNo = '31604871';
  const page = await browser.newPage();
  await page.goto('https://provider.ihx.in/');
  await page.type('#login-form_username', 'Satish1018381@medibuddy.in');
  await page.type('#login-form_password', 'Cloud9ggn');
  await page.click('#login-form > div:nth-child(5) > div > button > span');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  const f = await page.$("[class='provider-name']");
  const text = await (await f.getProperty('textContent')).jsonValue();
  const data = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('table tr td'));
    return tds.map((td) => td.innerText);
  });
  const dataHead = await page.evaluate(() => {
    const ths = Array.from(document.querySelectorAll('table tr th'));
    return ths.map((th) => th.innerText);
  });
  let caseDetails = [text];
  for (let i = 0; i < data.length / dataHead.length; i++) {
    let obj = {};
    for (let j = 0; j < dataHead.length; j++) {
      if (dataHead[j] != '') obj[dataHead[j]] = data[i * dataHead.length + j];
    }
    caseDetails.push(obj);
  }
  const rowWithClaimNo = await page.$x(`//td[contains(text(),"${claimNo}")]`);
  if (rowWithClaimNo.length > 0) {
    await rowWithClaimNo[0].click();
    await page.waitForTimeout(2000);
    const ul = await page.$('.ant-timeline');
    const li = await ul.$$('.ant-timeline-item');
    li.forEach(async element => {
      const timelineDetail = await (await element.getProperty("textContent")).jsonValue();
      console.log(timelineDetail);
    });
  }
  await page.waitForTimeout(1000);
  await browser.close();
  return caseDetails;
};

scrape().then((value) => {
  console.log(value); // Success!
});
