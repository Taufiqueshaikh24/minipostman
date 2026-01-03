import { run , all } from "../utils/dbAsync.js";



export const saveExecution = async ({
  requestId,
  status,
  responseBody,
  responseHeaders,
  duration,
  error,
}) => {
  return await run(
    `INSERT INTO api_request_executions
     (request_id, status, response_body, response_headers, duration, error)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      requestId,
      status,
      JSON.stringify(responseBody),
      JSON.stringify(responseHeaders),
      duration,
      error || null,
    ]
  );
};




export const getExecutionsByRequest = async (requestId) => {
  return await all(
    `SELECT *
     FROM api_request_executions
     WHERE request_id = ?
     ORDER BY executed_at DESC`,
    [requestId]
  );
};




