import { Container, Heading } from '@chakra-ui/react';

import { useGetScheduleSettingsQuery } from '../../services/schedule-settings.api';
import { ErrorResult, StackSkeleton } from '../../components';
import ScheduleSettingsForm from './ScheduleSettingsForm';

export default function ScheduleSettingsPage() {
  const { data, isLoading, isError, error } = useGetScheduleSettingsQuery();

  return (
    <Container maxW="container.xl" pb={3}>
      <Heading as="h2" textAlign="center" mb="3">
        Settings
      </Heading>
      {isLoading && <StackSkeleton />}
      {isError && <ErrorResult error={error} />}
      {data && <ScheduleSettingsForm data={data} />}
    </Container>
  );
}
