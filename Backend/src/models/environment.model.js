import { run, all, get } from '../utils/dbAsync.js';

export const createEnvironment = async (userId, name, variables) => {
  const result = await run(
    `INSERT INTO environments (user_id, name, variables)
     VALUES (?, ?, ?)`,
    [userId, name, JSON.stringify(variables)]
  );
  return result.lastID;
};

export const getEnvironmentsByUser = async (userId) =>
  all(
    `SELECT *
     FROM environments
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

export const getEnvironmentById = async (id, userId) =>
  get(
    `SELECT *
     FROM environments
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );


 export const deleteEnvironment = async (id, userId) => {
  return await run(
    `DELETE FROM environments
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
};