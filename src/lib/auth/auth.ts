export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePassword(password: string): boolean {
  return password.trim().length >= 8;
}

export function getAuthErrors(email: string, password: string): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format.';
  }

  if (!password.trim()) {
    errors.password = 'Password is required.';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
}
