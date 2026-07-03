export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']).{8,16}$/;

export function validateName(name) {
  const len = (name || '').trim().length;
  if (len < 20) return 'Name must be at least 20 characters long.';
  if (len > 60) return 'Name must not exceed 60 characters.';
  return null;
}

export function validateAddress(address) {
  if (!address || address.trim().length === 0) return 'Address is required.';
  if (address.length > 400) return 'Address must not exceed 400 characters.';
  return null;
}

export function validateEmail(email) {
  if (!EMAIL_REGEX.test(email || '')) return 'A valid email address is required.';
  return null;
}

export function validatePassword(password) {
  if (!PASSWORD_REGEX.test(password || '')) {
    return 'Password must be 8-16 characters and include at least one uppercase letter and one special character.';
  }
  return null;
}

export const inputClass =
  'w-full rounded border border-ink/20 bg-white px-3 py-2 font-body text-sm text-ink placeholder:text-ink/30 focus:border-brass focus:outline-none';
