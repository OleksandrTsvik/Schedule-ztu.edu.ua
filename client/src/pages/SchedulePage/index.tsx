import { Container } from '@chakra-ui/react';

import { useGetScheduleQuery } from '../../services/schedule.api';
import { ErrorResult, Loading } from '../../components';
import Schedule from './Schedule';

export default function SchedulePage() {
  const { data, isLoading, isError, error } = useGetScheduleQuery();

  return (
    <Container minW={isLoading ? undefined : 768} maxW={2048} p={0}>
      {isLoading && (
        <Loading
          text="Loading schedule..."
          boxProps={{ minHeight: undefined, height: '100%' }}
        />
      )}
      {isError && <ErrorResult error={error} />}
      {data && <Schedule data={data} />}
    </Container>
  );
}
