function checkPassword(password) {
  const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
  if (password.search(/([A-Z])\w+/g) === -1 || password.search(/\d/g) === -1 || password.split('').filter(char => specialChars.includes(char)).length === 0) {
    return false;
  } else {
    return true;
  }
}

export default checkPassword;
