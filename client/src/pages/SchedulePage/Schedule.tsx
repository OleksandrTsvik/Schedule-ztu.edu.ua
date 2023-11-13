import { Stack } from '@chakra-ui/react';

import ScheduleDisplayedDto from '../../models/schedule.interface';
import ScheduleTable from './ScheduleTable';

interface Props {
  data: ScheduleDisplayedDto;
}

export default function Schedule({ data }: Props) {
  return (
    <Stack spacing={5}>
      {data.schedule.map((scheduleWeek, index) => (
        <ScheduleTable
          key={index}
          schedule={scheduleWeek}
          activeWeekday={
            data.scheduleWeek === index + 1 ? data.scheduleWeekday : undefined
          }
        />
      ))}
    </Stack>
  );
}
