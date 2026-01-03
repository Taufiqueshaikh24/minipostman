import { parseCurl } from '../utils/curlParser.js';
import { createRequest, addHeaders } from '../models/request.model.js';

export const importCurl = async (userId, name, curlCommand) => {
  const parsed = parseCurl(curlCommand);

  const requestId = await createRequest(userId, {
    name,
    method: parsed.method,
    url: parsed.url,
    body: parsed.body,
  });

  if (parsed.headers.length) {
    await addHeaders(requestId, parsed.headers);
  }

  return requestId;
};
