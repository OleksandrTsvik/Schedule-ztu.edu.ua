import { Link, Stack } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

import ScheduleDisplayedDto from '../../models/schedule.interface';
import { ErrorResult, WarningResult } from '../../components';
import ScheduleTable from './ScheduleTable';

interface Props {
  data: ScheduleDisplayedDto;
}

export default function Schedule({ data }: Props) {
  if (data.schedule.length === 0) {
    return (
      <WarningResult
        title="There are no subjects to display in the schedule"
        text={
          <>
            To fix this, try changing the{' '}
            <Link as={ReactRouterLink} to="/settings" color="blue.400">
              schedule settings
            </Link>
          </>
        }
      />
    );
  }

  return (
    <>
      {data.errors.length > 0 && <ErrorResult text={data.errors} />}
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
    </>
  );
}
