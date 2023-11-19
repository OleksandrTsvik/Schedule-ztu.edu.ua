import * as Yup from 'yup';

import { UserRegisterDto } from '../../models/user.interface';

export const registerValidationSchema: Yup.Schema<UserRegisterDto> = Yup.object(
  {
    username: Yup.string().min(1).max(32).required('The username is required'),
    password: Yup.string().min(6).max(32).required('The password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('The confirm password is required'),
  },
);
