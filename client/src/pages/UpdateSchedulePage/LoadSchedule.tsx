import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';

import { LoadType, useLoadScheduleMutation } from '../../services/schedule.api';
import mutationWithToast from '../../utils/helpers/mutationWithToast';

export default function LoadSchedule() {
  const [loadSchedule, { isLoading }] = useLoadScheduleMutation();
  const [loadType, setLoadType] = useState(LoadType.DEFAULT);

  async function handleLoadSchedule() {
    await mutationWithToast({
      mutation: loadSchedule,
      argument: { loadType },
    });
  }

  return (
    <Box>
      <Heading as="h4" size="md" mt={5} mb={2}>
        Update schedule
      </Heading>
      <RadioGroup
        as={Stack}
        name="load-type"
        mb={4}
        value={loadType}
        onChange={(nextValue) => setLoadType(nextValue as LoadType)}
      >
        <Radio value={LoadType.DEFAULT}>
          Update the schedule while maintaining the settings for displaying
          subjects
        </Radio>
        <Radio value={LoadType.FULLY}>Fully update the schedule</Radio>
      </RadioGroup>
      <Button
        width="100%"
        colorScheme="blue"
        variant="outline"
        loadingText="Updating schedule"
        isLoading={isLoading}
        onClick={handleLoadSchedule}
      >
        Update schedule
      </Button>
    </Box>
  );
}