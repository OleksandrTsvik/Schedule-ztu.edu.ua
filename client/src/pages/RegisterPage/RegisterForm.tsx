import { Stack, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';

import formikSubmitMutationWithToast from '../../utils/helpers/formikSubmitMutationWithToast';
import { useRegisterMutation } from '../../auth/auth.api';
import { setCredentials } from '../../auth/auth.slice';
import { UserRegisterDto } from '../../models/user.interface';
import { useAppDispatch } from '../../hooks/store';
import { FormikInput, FormikPasswordInput } from '../../components';
import { registerValidationSchema } from './register.validation-schema';

export default function RegisterForm() {
  const appDispatch = useAppDispatch();
  const [register] = useRegisterMutation();

  const initialValues: UserRegisterDto = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerValidationSchema}
      onSubmit={formikSubmitMutationWithToast({
        handleSubmit: register,
        afterSubmit: (data) => appDispatch(setCredentials(data)),
        showToastSuccess: false,
      })}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormikInput name="username" label="Username" />
            <FormikPasswordInput name="password" label="Password" />
            <FormikPasswordInput
              name="confirmPassword"
              label="Confirm your password"
            />
            <Button
              type="submit"
              colorScheme="blue"
              mt={3}
              isLoading={isSubmitting}
              loadingText="Creating your accountt"
            >
              Sign up
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
