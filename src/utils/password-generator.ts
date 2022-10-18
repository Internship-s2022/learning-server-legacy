const generatePassword = (length: number) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomPassword = '';
  for (let i = 0; i <= length; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    randomPassword += chars.substring(randomNumber, randomNumber + 1);
  }
  return randomPassword;
};

export default generatePassword;
