import puppeteer from 'puppeteer';

const treatmentTypes = {
  Surgical: 'proposedLineOfTreatment-1123',
  Maternity: 'proposedLineOfTreatment-1123',
  'Medical Management': 'proposedLineOfTreatment-1112',
  Investigation: 'proposedLineOfTreatment-1114',
  'Intensive Care': 'proposedLineOfTreatment-1113',
};

const tpaName = 'Medi Assist Insurance TPA India Pvt Ltd';
const policy = {
  type: 'retail',
  policy_no: '4018827750',
  uhid: '4018827750',
  employeeId: 'EMP12345',
  employerName: 'ANH Technologies Pvt. Ltd.',
};

const treatmentDetails = {
  doa: '2023-03-28',
  dod: '2023-04-02',
  type: 'Surgical',
  name: 'C- Section ( LSCS)',
  doctorName: 'Dr. Parv Jain'
};

const patientDetails = {
  fullName: 'Anupama Gopalan',
  mobile: '8088568149',
};

function dateConverter(d) {
  return (
    new Date(d).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) + ' 09:00 AM'
  );
}

let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1080, height: 1224 },
  });
  const page = await browser.newPage();
  await page.goto('https://provider.ihx.in/');
  await page.setViewport({ width: 1080, height: 624 });
  await page.type('#login-form_username', 'Insurancemwm@cloudninecare.com');
  await page.type('#login-form_password', 'Cloud9@12345');
  // await page.type('#login-form_username', 'Satish1018381@medibuddy.in');
  // await page.type('#login-form_password', 'Cloud9ggn');
  await page.click('#login-form > div:nth-child(5) > div > button > span');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.click(
    '#root > div > section > div.right-content > div > div > div.tab-header > div > div.ant-col.header-right.ant-col-md-18 > form > div > div:nth-child(2) > div > div > div > div > button > span'
  );
  await page.type('#payer', tpaName);
  const [button] = await page.$x(
    `//div[@class='rc-virtual-list-holder-inner']/div[contains(., '${tpaName}')]`
  );
  if (button) {
    await button.click();
    const iHaveButton = await page.$x(`//div[@data-testid="iHave"]`);
    await page.waitForTimeout(5000);
    await iHaveButton[0].click();
    await page.waitForTimeout(1000);

    if (policy.uhid) {
      const [uhidButton] = await page.$x(
        `//div[@data-testid='iHave-Member ID']`
      );
      await uhidButton.click();
      await page.type('#memberId', policy.uhid);
    } else if (policy.policy_no) {
      const [policyNumberButton] = await page.$x(
        `//div[@data-testid='iHave-Policy No.']`
      );
      await policyNumberButton.click();
      await page.type('#policyNumber', policy.policy_no);
    } else {
      const [employeeIdButton] = await page.$x(
        `//div[@data-testid='iHave-Employee ID']`
      );
      await employeeIdButton.click();
      await page.type('#employeeId', policy.employeeId);
      await page.type('#corporateName', policy.employerName);
    }
    await page.type('#patientName', patientDetails.fullName);
    await page.click(
      '#root > div > section > div.right-content > div > div > div.ant-tabs-content-holder.tab-custom-container.pb-0 > div > div.ant-col.ant-col-md-16 > div > div > div.sticky-panel.scrollbar.normal-panel-height > div > div.ant-card.ant-card-bordered.panel-styles.undefined > div.ant-card-body > form > div:nth-child(2) > div.ant-col.ant-col-offset-19.text-right.ant-col-md-5 > button'
    );
    await page.waitForTimeout(10000);
    const patientRegistered = await page.$x(
      `//div[@class='ant-card-body']/div/div/div/span[contains(.,'Member name: ')]`
    );
    if (patientRegistered.length > 0) {
      patientRegistered[0].click();
    }
    await page.waitForSelector('#mobile', {timeout: 50000})
    await page.type('#mobile', patientDetails.mobile);
    await page.click(
      '#root > div > section > div.right-content > div > div > div.ant-tabs-content-holder.tab-custom-container.pb-0 > div > div.ant-col.ant-col-md-16 > div > div > div.sticky-panel.scrollbar.normal-panel-height > form > div.ant-row.mb-md > div.ant-col.text-right.ant-col-md-12 > button'
    );
    await page.waitForSelector('#dateOfAdmission')
    await page.type('#dateOfAdmission', dateConverter(treatmentDetails.doa));
    await page.keyboard.press('Enter');
    await page.type('#dateOfDischarge', dateConverter(treatmentDetails.dod));
    await page.keyboard.press('Enter');
    await page.click(
      `input[data-testid=${treatmentTypes[treatmentDetails.type]}]`
    );
    const automatedTreatment = await page.$x(
      `//div[@data-testid='automatedProcedure']`
    );
    automatedTreatment[0].click();
    await page.waitForTimeout(5000);
    const automatedTreatmentName = await page.$x(`//div[@title='Dialysis']`)
    automatedTreatmentName[0].click()
    await page.waitForSelector('#dialysis')
    await page.type('#dialysis', '5')
    const doctorNameButton = await page.$x(`//div[@data-testid='doctorName']`)
    if(doctorNameButton.length > 0) doctorNameButton[0].click()
    await page.type('#doctorName', treatmentDetails.doctorName)
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000)
    const roomTypeButton = await page.$x(`//div[@data-testid='hospitalRoomType']`)
    if(roomTypeButton.length > 0) roomTypeButton[0].click()
    else console.log(roomTypeButton.length)
    await page.waitForTimeout(5000)
    const roomTypeButtonSelect = await page.$x(`//div[@title='PICU/HDU']`)
    roomTypeButtonSelect.length > 0 ? roomTypeButtonSelect[0].click() : console.log(roomTypeButtonSelect.length)
    await page.click('#root > div > section > div.right-content > div > div > div.ant-tabs-content-holder.tab-custom-container.pb-0 > div > div.ant-col.ant-col-md-16 > div > div > div.sticky-panel.scrollbar.normal-panel-height > form > div.ant-row.mb-md > div.ant-col.text-right.ant-col-md-12 > button')
    await page.waitForTimeout(3000)
    await page.click(
      `input[data-testid='1381283-1381283-16290-PVT_WARD']`
    );
    await page.click('#root > div > section > div.right-content > div > div > div.tab-header > div > div.ant-col.header-right.ant-col-md-18 > div > div:nth-child(4) > button')
    await page.waitForTimeout(3000)
    const inputUploadHandle = await page.$('input[type=file]');
    let fileToUpload = 'anupama-gopaln-pa.pdf';
    inputUploadHandle.uploadFile(fileToUpload);
    
    //automatedTreatmentName[0].click()
    //if (automatedTreatmentName.length > 0) automatedTreatmentName[0].click();
    // else {
    //   automatedTreatmentName = await page.$x(`//div[@title='Others']`);
    //   automatedTreatmentName[0].click();
    // }
  }
  return 'returned value';
};

scrape().then((value) => {
  console.log(value); // Success!
});
