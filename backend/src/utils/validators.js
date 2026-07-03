// Validation rules exactly as specified in the assignment:
// Name: Min 20 characters, Max 60 characters.
// Address: Max 400 characters.
// Password: 8-16 characters, must include at least one uppercase letter and one special character.
// Email: Must follow standard email validation rules.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']).{8,16}$/;

function validateName(name) {
  if (typeof name !== 'string') return 'Name is required.';
  const len = name.trim().length;
  if (len < 20) return 'Name must be at least 20 characters long.';
  if (len > 60) return 'Name must not exceed 60 characters.';
  return null;
}

function validateAddress(address) {
  if (typeof address !== 'string' || address.trim().length === 0) {
    return 'Address is required.';
  }
  if (address.length > 400) return 'Address must not exceed 400 characters.';
  return null;
}

function validateEmail(email) {
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return 'A valid email address is required.';
  }
  return null;
}

function validatePassword(password) {
  if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
    return 'Password must be 8-16 characters and include at least one uppercase letter and one special character.';
  }
  return null;
}

function validateRating(rating) {
  const n = Number(rating);
  if (!Number.isInteger(n) || n < 1 || n > 5) {
    return 'Rating must be an integer between 1 and 5.';
  }
  return null;
}

module.exports = {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
  validateRating,
};
