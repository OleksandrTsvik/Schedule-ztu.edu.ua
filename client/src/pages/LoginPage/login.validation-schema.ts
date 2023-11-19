import * as Yup from 'yup';

import { UserLoginDto } from '../../models/user.interface';

export const loginValidationSchema: Yup.Schema<UserLoginDto> = Yup.object({
  username: Yup.string().min(1).max(32).required('The username is required'),
  password: Yup.string().min(6).max(32).required('The password is required'),
});
