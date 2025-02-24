import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (pass1, pass2) => {
  return bcrypt.compare(pass1, pass2);
};
