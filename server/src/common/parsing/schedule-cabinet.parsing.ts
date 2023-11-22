import puppeteer from 'puppeteer';

import CabinetSubject from '../interfaces/cabinet-subject.interface';

export default async function parsingScheduleCabinet(
  loginUrl: string,
  scheduleUrl: string,
  login: string,
  password: string,
): Promise<CabinetSubject[]> {
  const browser = await puppeteer.launch({ headless: 'new' });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(7000);

  let response = await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });

  if (!response?.ok()) {
    throw new Error(
      `The cabinet login page is not working, the status is "${response?.status()}", according to the link - ${loginUrl}.`,
    );
  }

  await page.$eval(
    '#loginform-username',
    (elem, login) => {
      if (elem instanceof HTMLInputElement) {
        elem.value = login;
      }
    },
    login,
  );

  await page.$eval(
    '#loginform-password',
    (elem, password) => {
      if (elem instanceof HTMLInputElement) {
        elem.value = password;
      }
    },
    password,
  );

  await page.click('#login-form button[type="submit"][name="login-button"]');
  response = await page.waitForNavigation();

  if (!response || !response.ok() || response.request().url() === loginUrl) {
    throw new Error('Could not log in to your cabinet account.');
  }

  response = await page.goto(scheduleUrl, { waitUntil: 'domcontentloaded' });

  if (!response?.ok()) {
    throw new Error(
      `Login error in your cabinet account, the status is "${response?.status()}", according to the link - ${scheduleUrl}.`,
    );
  }

  const schedule: CabinetSubject[] = await page.$$eval('.pair', (elems) => {
    const data: CabinetSubject[] = [];

    for (const elem of elems) {
      const firstElementChild = elem.firstElementChild;
      const lastElementChild = elem.lastElementChild;

      if (!firstElementChild || !lastElementChild) {
        continue;
      }

      const time = firstElementChild.children[0].textContent;
      const subject = firstElementChild.children[1].textContent;

      const classroom =
        firstElementChild.children[2].textContent +
        ',ауд. ' +
        firstElementChild.children[3].textContent;

      const teacher = firstElementChild.children[4].textContent;
      const content = lastElementChild.children[1].innerHTML;

      if (!time || !subject || !teacher) {
        continue;
      }

      data.push({
        time,
        subject,
        classroom,
        teacher,
        content,
      });
    }

    return data;
  });

  await browser.close();

  return schedule;
}
