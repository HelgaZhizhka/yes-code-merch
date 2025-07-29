export type AuthCredentials = {
  email: string;
  password: string;
};

export type ResetPasswordDTO = { email: string };
export type UpdateUserDTO = Partial<Pick<AuthCredentials, 'password'>>;
