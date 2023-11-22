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
  FormikPasswordInput,
  InfoTooltip,
} from '../../components';
import { scheduleSettingsValidationSchema } from './schedule-settings.validation-schema';
import GroupSelect from './GroupSelect';

interface Props {
  data?: ScheduleSettings;
}

export default function ScheduleSettingsForm({ data }: Props) {
  const [updateScheduleSettings] = useUpdateScheduleSettingsMutation();

  const initialValues: UpdateScheduleSettingsDto = data
    ? {
        ...data,
        dateFirstWeekSchedule: formatDateForInput(data.dateFirstWeekSchedule),
        linkToSelectiveSubjects: data.linkToSelectiveSubjects || '',
        cabinetLogin: data.cabinetLogin || '',
        cabinetPassword: '',
      }
    : {
        scheduleForGroup: '',
        dateFirstWeekSchedule: '',
        linkToSelectiveSubjects: '',
        weekForSelectiveSubjects: 1,
        isLoadCabinentContent: false,
        cabinetLogin: '',
        cabinetPassword: '',
      };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={scheduleSettingsValidationSchema}
      onSubmit={formikSubmitMutationWithToast({
        handleSubmit: updateScheduleSettings,
      })}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <GroupSelect />
            <FormikInput
              name="dateFirstWeekSchedule"
              label={
                <>
                  Schedule date of the first week
                  <InfoTooltip label="Required to correctly display the current day in the schedule." />
                </>
              }
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
              label={
                <>
                  Load content from your cabinent account?
                  <InfoTooltip label="This will slow down the loading of the schedule. Also, enter the correct username and password." />
                </>
              }
            />
            <FormikInput name="cabinetLogin" label="Cabinet login" />
            <FormikPasswordInput
              name="cabinetPassword"
              label="Cabinet password"
            />
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
