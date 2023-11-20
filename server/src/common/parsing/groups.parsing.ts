import puppeteer from 'puppeteer';

import ResultParsingGroups from '../interfaces/result-parsing-groups.interface';

export default async function parsingGroups(
  groupsUrl: string,
): Promise<ResultParsingGroups[]> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(groupsUrl, { waitUntil: 'domcontentloaded' });

  const resultParsing = await page.evaluate((): ResultParsingGroups[] => {
    const resultParsingGroups: ResultParsingGroups[] = [];

    const deleteWhitespace = (text: string | null): string => {
      if (!text) {
        return '';
      }

      return text.trim().replace(/[\s\\n]{2,}/g, ' ');
    };

    // eslint-disable-next-line
    const faculties = document.querySelectorAll(
      'div > div.container > div.row.auto-clear',
    );

    for (const faculty of faculties) {
      const elemFaculty = faculty.querySelector('div:first-of-type');
      const elemsGroups = faculty.querySelectorAll(
        'div.collection a.collection-item',
      );

      if (!elemFaculty || elemsGroups.length === 0) {
        continue;
      }

      const textFaculty = deleteWhitespace(elemFaculty.textContent);

      if (!textFaculty) {
        continue;
      }

      const groups: string[] = [];

      for (const elemGroup of elemsGroups) {
        const textGroup = deleteWhitespace(elemGroup.textContent);

        if (!textGroup) {
          continue;
        }

        groups.push(textGroup);
      }

      resultParsingGroups.push({
        faculty: textFaculty,
        groups,
      });
    }

    return resultParsingGroups;
  });

  await browser.close();

  return resultParsing;
}
