import { Container } from '@chakra-ui/react';

import DisplayPercentage from './DisplayPercentage';
import LoadSchedule from './LoadSchedule';

export default function DisplaySettingsPage() {
  return (
    <Container maxW="container.xl" pb={3}>
      <DisplayPercentage />
      <LoadSchedule />
    </Container>
  );
}
