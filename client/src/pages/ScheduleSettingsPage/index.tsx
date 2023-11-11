import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';

import formatDateForInput from '../../utils/helpers/formatDateForInput';
import { useGetScheduleSettingsQuery } from '../../services/schedule-settings.api';
import { ErrorResult, StackSkeleton } from '../../components';

export default function ScheduleSettingsPage() {
  const { data, isLoading } = useGetScheduleSettingsQuery();

  return (
    <Container maxW="container.xl" pb={3}>
      <Heading as="h2" textAlign="center" mb="3">
        Settings
      </Heading>
      {isLoading && <StackSkeleton />}
      {!data && !isLoading && <ErrorResult text="Missing data" />}
      {data && (
        <Stack spacing={3}>
          <FormControl>
            <FormLabel>Group</FormLabel>
            <Input defaultValue={data.scheduleForGroup} />
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>Schedule date of the first week</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <CalendarIcon />
              </InputLeftElement>
              <Input
                type="date"
                defaultValue={formatDateForInput(data.dateFirstWeekSchedule)}
              />
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Link to optional subjects (excel)</FormLabel>
            <Input defaultValue={data.linkToSelectiveSubjects} />
          </FormControl>
          <FormControl mb={5}>
            <FormLabel>Week number of the optional subjects</FormLabel>
            <NumberInput
              defaultValue={data.weekForSelectiveSubjects}
              min={1}
              max={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <Checkbox checked={data.isLoadCabinentContent}>
              Load content from your сabinent account?
            </Checkbox>
          </FormControl>
          <FormControl>
            <FormLabel>Cabinet login</FormLabel>
            <Input defaultValue={data.cabinetLogin} />
          </FormControl>
          <FormControl>
            <FormLabel>Cabinet password</FormLabel>
            <Input />
          </FormControl>
          <Box textAlign="right" mt={5}>
            <Button colorScheme="blue" width="25%">
              Save
            </Button>
          </Box>
        </Stack>
      )}
    </Container>
  );
}
