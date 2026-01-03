import { run, get } from '../utils/dbAsync.js';

export const createUser = async (email, passwordHash) => {
  const result = await run(
    `INSERT INTO users (email, password_hash)
     VALUES (?, ?)`,
    [email, passwordHash]
  );
  return result.lastID;
};

export const findUserByEmail = async (email) =>
  get(`SELECT * FROM users WHERE email = ?`, [email]);

export const findUserById = async (id) =>
  get(`SELECT id, email, created_at FROM users WHERE id = ?`, [id]);
