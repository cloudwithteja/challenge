export enum UserError {
  USERNAME_REQUIRED = 1,
  PASSWORD_REQUIRED = 2,
  USERNAME_TOO_LONG = 3,
  USERNAME_INVALID_CHARACTERS = 4,
  PASSWORD_TOO_LONG = 5,
  PASSWORD_TOO_SHORT = 6,
  USERNAME_ALREADY_EXISTS,
}

export const MAX_USERNAME_LENGTH = 25;
export const MAX_PASSWORD_LENGTH = 100;
export const MIN_PASSWORD_LENGTH = 4;

export function validateAccount(username: string, password: string) {
  const errors = [];

  if (!username || username.trim().length === 0) {
    errors.push({ code: UserError.USERNAME_REQUIRED, message: 'Username is required' });
  } else if (username.includes(' ')) {
    errors.push({
      code: UserError.USERNAME_INVALID_CHARACTERS,
      message: 'Username contains invalid characters',
    });
  } else if (username.length > MAX_USERNAME_LENGTH) {
    errors.push({
      code: UserError.USERNAME_TOO_LONG,
      message: `Username is too long. Max length is ${MAX_USERNAME_LENGTH}`,
    });
  }

  if (!password || password.trim().length === 0) {
    errors.push({ code: UserError.PASSWORD_REQUIRED, message: 'Password is required' });
  } else if (password.length > MAX_PASSWORD_LENGTH) {
    errors.push({
      code: UserError.PASSWORD_TOO_LONG,
      message: `Password is too long. Max length is ${MAX_PASSWORD_LENGTH}`,
    });
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push({
      code: UserError.PASSWORD_TOO_SHORT,
      message: `Password is too short. Min length is ${MIN_PASSWORD_LENGTH}`,
    });
  }

  return { errors };
}
