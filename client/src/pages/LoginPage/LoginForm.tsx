import { Button, Stack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';

import formikSubmitMutationWithToast from '../../utils/helpers/formikSubmitMutationWithToast';
import { useLoginMutation } from '../../auth/auth.api';
import { setCredentials } from '../../auth/auth.slice';
import { useAppDispatch } from '../../hooks/store';
import { UserLoginDto } from '../../models/user.interface';
import { FormikInput } from '../../components';
import { loginValidationSchema } from './login.validation-schema';

export default function LoginForm() {
  const appDispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const initialValues: UserLoginDto = {
    username: '',
    password: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
      onSubmit={formikSubmitMutationWithToast({
        handleSubmit: login,
        afterSubmit: (data) => appDispatch(setCredentials(data)),
        showToastSuccess: false,
      })}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormikInput name="username" label="Username" />
            <FormikInput name="password" label="Password" />
            <Button
              type="submit"
              colorScheme="blue"
              mt={3}
              isLoading={isSubmitting}
              loadingText="Logging in to your account"
            >
              Sign in
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
