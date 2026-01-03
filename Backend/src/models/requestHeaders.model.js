import { all } from '../utils/dbAsync.js';

export const getHeadersByRequestId = async (requestId) => {
  return await all(
    `SELECT header_key AS key, header_value AS value
     FROM api_request_headers
     WHERE request_id = ?`,
    [requestId]
  );
};
