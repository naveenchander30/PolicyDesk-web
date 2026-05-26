import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, getAuthErrors } from './auth';

describe('validateEmail', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('returns false for invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('returns true for password 8+ characters', () => {
    expect(validatePassword('longenough123')).toBe(true);
  });

  it('returns false for password under 8 characters', () => {
    expect(validatePassword('short')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(validatePassword('')).toBe(false);
  });
});

describe('getAuthErrors', () => {
  it('returns empty errors for valid input', () => {
    expect(getAuthErrors('user@example.com', 'password123')).toEqual({});
  });

  it('returns email required when empty', () => {
    const errors = getAuthErrors('', 'password123');
    expect(errors.email).toBe('Email is required.');
  });

  it('returns invalid email format', () => {
    const errors = getAuthErrors('bad', 'password123');
    expect(errors.email).toBe('Invalid email format.');
  });

  it('returns password required when empty', () => {
    const errors = getAuthErrors('user@example.com', '');
    expect(errors.password).toBe('Password is required.');
  });

  it('returns password too short', () => {
    const errors = getAuthErrors('user@example.com', 'short');
    expect(errors.password).toBe('Password must be at least 8 characters.');
  });

  it('returns multiple errors', () => {
    const errors = getAuthErrors('', '');
    expect(errors.email).toBe('Email is required.');
    expect(errors.password).toBe('Password is required.');
  });
});
