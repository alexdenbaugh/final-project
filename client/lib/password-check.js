const SPECIAL_CHARS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

export default function checkPassword(password) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = password.split('').some(char => SPECIAL_CHARS.includes(char));

  return hasUpperCase && hasNumber && hasSpecialChar;
}
