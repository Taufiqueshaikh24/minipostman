import { run, all, get } from '../utils/dbAsync.js';

export const createCollection = async (userId, name, description) => {
  const result = await run(
    `INSERT INTO collections (user_id, name, description)
     VALUES (?, ?, ?)`,
    [userId, name, description || null]
  );
  return result.lastID;
};

export const getCollectionsByUser = async (userId) =>
  all(
    `SELECT *
     FROM collections
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

export const deleteCollection = async (id, userId) =>
  run(
    `DELETE FROM collections
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
