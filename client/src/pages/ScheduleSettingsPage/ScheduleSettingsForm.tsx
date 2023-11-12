import { Form, Formik } from 'formik';
import { Stack, Button, Box } from '@chakra-ui/react';

import formatDateForInput from '../../utils/helpers/formatDateForInput';
import formikSubmitMutationWithToast from '../../utils/helpers/formikSubmitMutationWithToast';
import ScheduleSettings, {
  UpdateScheduleSettingsDto,
} from '../../models/schedule-settings.interface';
import { useUpdateScheduleSettingsMutation } from '../../services/schedule-settings.api';
import {
  FormikCheckbox,
  FormikInput,
  FormikNumberInput,
} from '../../components';

interface Props {
  data: ScheduleSettings;
}

export default function ScheduleSettingsForm({ data }: Props) {
  const [updateScheduleSettings] = useUpdateScheduleSettingsMutation();

  const initialValues: UpdateScheduleSettingsDto = {
    ...data,
    dateFirstWeekSchedule: formatDateForInput(data.dateFirstWeekSchedule),
    linkToSelectiveSubjects: data.linkToSelectiveSubjects || '',
    cabinetLogin: data.cabinetLogin || '',
    cabinetPassword: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={formikSubmitMutationWithToast(updateScheduleSettings)}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormikInput name="scheduleForGroup" label="Group" />
            <FormikInput
              name="dateFirstWeekSchedule"
              label="Schedule date of the first week"
              type="date"
              controlProps={{ mb: 5 }}
            />
            <FormikInput
              name="linkToSelectiveSubjects"
              label="Link to optional subjects (excel)"
            />
            <FormikNumberInput
              name="weekForSelectiveSubjects"
              label="Week number of the optional subjects"
              min={1}
              max={2}
              controlProps={{ mb: 5 }}
            />
            <FormikCheckbox
              name="isLoadCabinentContent"
              label="Load content from your cabinent account?"
            />
            <FormikInput name="cabinetLogin" label="Cabinet login" />
            <FormikInput name="cabinetPassword" label="Cabinet password" />
            <Box textAlign="right" mt={5}>
              <Button
                type="submit"
                colorScheme="blue"
                width="25%"
                isLoading={isSubmitting}
                loadingText="Saving"
              >
                Save
              </Button>
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
