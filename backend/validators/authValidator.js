
const validateSignup = (data) => {
  const errors = [];

  const { name, email, password } = data;

  if (!name || !name.trim()) {
    errors.push("Name is required");
  } else if (name.trim().length < 2) {
    errors.push("Name must contain at least 2 characters");
  }

  if (!email || !email.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must contain at least 6 characters");
  }

  return errors;
};

const validateLogin = (data) => {
  const errors = [];

  if (!data.email || !data.email.trim()) {
    errors.push("Email is required");
  }

  if (!data.password) {
    errors.push("Password is required");
  }

  return errors;
};

module.exports = {
  validateSignup,
  validateLogin,
};
