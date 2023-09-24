import axios from 'axios';
import * as xlsx from 'xlsx';

import ScheduleSubject from '../interfaces/schedule-subject.interface';
import uaDayToNumber from '../utils/ua-day-to-number.util';
import upperCaseFirst from '../utils/upper-case-first.util';

export default async function parsingScheduleGoogleExcel(
  selectiveSubjectsUrl: string,
  week: number,
): Promise<ScheduleSubject[]> {
  const response = await axios({
    method: 'GET',
    url: selectiveSubjectsUrl,
    responseType: 'arraybuffer',
  });

  if (response.status !== 200) {
    throw new Error(
      `An error occurred while accessing the schedule in google excel, the status is "${response.status}", according to the link - ${selectiveSubjectsUrl}.`,
    );
  }

  const workbook = xlsx.read(response.data);
  const sheet01 = workbook.Sheets[workbook.SheetNames[0]];

  let sheet01JSON = xlsx.utils.sheet_to_json(sheet01);
  sheet01JSON = sheet01JSON.filter((obj: any) => Object.keys(obj).length >= 6);
  sheet01JSON = sheet01JSON.slice(1);

  // console.log(sheet01JSON[0]);

  const shedule: ScheduleSubject[] = [];

  for (const obj of sheet01JSON as any[]) {
    const groups: string[] = [];

    if (obj.G) {
      groups.push(obj.G.trim());
    }

    shedule.push({
      week,
      weekday: uaDayToNumber(upperCaseFirst(obj.F)),
      time: obj.B,
      subject: obj.C,
      classroom: obj.E,
      teachers: obj.D.split(/,\s*/).filter(
        (str: any) => str && str.trim().length > 0,
      ),
      groups,
    });
  }

  // console.log(shedule);

  return shedule;
}
