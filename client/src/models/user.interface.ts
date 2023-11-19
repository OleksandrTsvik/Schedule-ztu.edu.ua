export default interface User {
  id: string;
  username: string;
}

export interface UserRegisterDto {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface UserLoginDto {
  username: string;
  password: string;
}
