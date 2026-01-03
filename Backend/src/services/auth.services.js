import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/user.model.js';
import { ENV } from '../config/env.js';

export const signup = async (email, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await createUser(email, passwordHash);

  // DO NOT RETURN TOKEN HERE
  return true;
};

export const login = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { userId: user.id },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, userId: user.id };
};
