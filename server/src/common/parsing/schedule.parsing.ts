import puppeteer from 'puppeteer';

import ScheduleSubject from '../interfaces/schedule-subject.interface';
import ResultParsingSchedule from '../interfaces/result-parsing-schedule.interface';

export default async function parsingSchedule(
  scheduleUrl: string,
): Promise<ResultParsingSchedule> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto(scheduleUrl, { waitUntil: 'domcontentloaded' });

  const resultParsing = await page.evaluate((): ResultParsingSchedule => {
    const schedule: ScheduleSubject[] = [];
    const times: string[] = [];

    const deleteWhitespace = (text: string | null): string => {
      if (!text) {
        return '';
      }

      return text.trim().replace(/[\s\\n]{2,}/g, ' ');
    };

    const deleteWhitespaceAndGetArray = (
      text: string | null,
      separator: string | RegExp = /,\s*/,
      filter: (value: string, index: number, array: string[]) => boolean = (
        str,
      ) => str.trim().length > 0,
    ): string[] => {
      return deleteWhitespace(text).split(separator).filter(filter);
    };

    const getSubjectsData = (
      elements: NodeListOf<Element>,
      week: number,
      weekday: number,
      time: string,
    ): ScheduleSubject[] => {
      const subjects: ScheduleSubject[] = [];

      for (const elem of elements) {
        if (elem.children.length < 4) {
          continue;
        }

        subjects.push({
          week,
          weekday,
          time,
          subject: deleteWhitespace(elem.children[1].textContent),
          classroom: deleteWhitespace(elem.children[2].textContent),
          teachers: deleteWhitespaceAndGetArray(elem.children[3].textContent),
          groups: deleteWhitespaceAndGetArray(elem.children[0].textContent),
        });
      }

      return subjects;
    };

    // eslint-disable-next-line
    const tables = document.querySelectorAll('table.schedule');
    let week = 1;

    for (const table of tables) {
      const tableRows = table.querySelectorAll('tr:not(:first-of-type)');

      for (const tr of tableRows) {
        let time = '';
        let weekday = 1;

        const thTime = tr.querySelector('th');

        if (thTime) {
          time = deleteWhitespace(thTime.textContent);
        }

        times.push(time);
        const tdListSubjects = tr.querySelectorAll('td');

        for (const tdSubject of tdListSubjects) {
          const arrSubjects = tdSubject.querySelectorAll('div.variative');

          const subjectsData = getSubjectsData(
            arrSubjects,
            week,
            weekday,
            time,
          );

          schedule.push(...subjectsData);

          weekday++;
        }
      }

      week++;
    }

    return { schedule, times };
  });

  await browser.close();

  return resultParsing;
}
