/**
 * Validates an email address.
 * Rejects emojis and special symbols. Only allows letters, numbers,
 * and standard email characters: '.', '_', '%', '+', '-' and a single '@'.
 * 
 * @param email The email address to validate
 * @returns true if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  if (email.length < 6 || email.length > 50) {
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9]+(?:[._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
