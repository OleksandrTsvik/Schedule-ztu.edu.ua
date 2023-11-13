import { Container } from '@chakra-ui/react';

import { useGetScheduleQuery } from '../../services/schedule.api';
import { ErrorResult, StackSkeleton } from '../../components';
import Schedule from './Schedule';

export default function SchedulePage() {
  const { data, isLoading, isError, error } = useGetScheduleQuery();

  return (
    <Container maxW={2048} p={0}>
      {isLoading && <StackSkeleton />}
      {isError && <ErrorResult error={error} />}
      {data && <Schedule data={data} />}
    </Container>
  );
}
