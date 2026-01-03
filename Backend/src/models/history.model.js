import { run } from '../utils/dbAsync.js';

export const logRequestExecution = async (data) => {
  const {
    requestId,
    userId,
    method,
    url,
    statusCode,
    responseTimeMs,
  } = data;

  await run(
    `INSERT INTO api_request_history
     (request_id, user_id, method, url, status_code, response_time_ms)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      requestId,
      userId,
      method,
      url,
      statusCode,
      responseTimeMs,
    ]
  );
};
