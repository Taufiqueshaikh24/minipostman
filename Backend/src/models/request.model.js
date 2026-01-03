import { run, all, get } from '../utils/dbAsync.js';


export const createRequest = async (userId, data) => {
  const { name, method, url, body } = data;

  const result = await run(
    `INSERT INTO api_requests (user_id, name, method, url, body)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, name, method, url, body || null]
  );

  return result.lastID;
};


export const addHeaders = async (requestId, headers = []) => {
  for (const { key, value } of headers) {
    await run(
      `INSERT INTO api_request_headers (request_id, header_key, header_value)
       VALUES (?, ?, ?)`,
      [requestId, key, value]
    );
  }
};


export const getRequestsByUser = async (userId) => {
  return await all(
    `SELECT *
     FROM api_requests
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
};


// export const getHeadersByRequestId = async (requestId) => {
//   return await all(
//     `SELECT header_key AS key, header_value AS value
//      FROM api_request_headers
//      WHERE request_id = ?`,
//     [requestId]
//   );
// };


export const getRequestById = async (id, userId) => {
  return await get(
    `SELECT *
     FROM api_requests
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
};


export const deleteRequest = async (requestId, userId) => {
  return await run(
    `DELETE FROM api_requests
     WHERE id = ? AND user_id = ?`,
    [requestId, userId]
  );
};











