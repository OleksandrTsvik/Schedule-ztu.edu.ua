import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';

import getErrorObject from '../../utils/helpers/getErrorObject';
import { toast } from '../../utils/chakra/toast';
import { LoadType, useLoadScheduleMutation } from '../../services/schedule.api';
import { ErrorMessage } from '../../components';

export default function LoadSchedule() {
  const [loadSchedule, { isLoading }] = useLoadScheduleMutation();
  const [loadType, setLoadType] = useState(LoadType.FULLY);

  async function handleLoadSchedule() {
    try {
      await loadSchedule({ loadType }).unwrap();
    } catch (error) {
      const errorObject = getErrorObject(error);

      toast({
        status: 'error',
        title: errorObject.message,
        description: <ErrorMessage message={errorObject.description} />,
        isClosable: true,
        duration: 30000,
      });
    }
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
        <Radio value={LoadType.FULLY}>Fully update the schedule</Radio>
        <Radio value={LoadType.DEFAULT}>
          Update the schedule while maintaining the settings for displaying
          subjects
        </Radio>
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
