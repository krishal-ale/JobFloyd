export const isStrongPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return (
        password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasDigit &&
      hasSpecialChar
    );
  };

export const validateEmail = (email) => {
  if (!email) return false;

  const hasAtSymbol = email.includes("@");
  const hasDot = email.includes(".");
  const hasNoSpaces = !email.includes(" ");

  const parts = email.split("@");
  const hasOneAt = parts.length === 2;

  return hasAtSymbol && hasDot && hasNoSpaces && hasOneAt;
};
