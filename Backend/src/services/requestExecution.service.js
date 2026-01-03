import axios from 'axios';
import { getRequestById } from '../models/request.model.js';
import { getHeadersByRequestId } from '../models/requestHeaders.model.js';
import { saveExecution } from '../models/requestExecution.model.js';
import { getEnvironmentById } from '../models/environment.model.js';
import { resolveVariables } from '../utils/variableResolver.js';

export const executeRequest = async (requestId, userId, environmentId) => {
  const request = await getRequestById(requestId, userId);
  if (!request) {
    throw new Error('Request not found');
  }

  // 1️⃣ Load environment variables (optional)
  let envVars = {};
  if (environmentId) {
    const env = await getEnvironmentById(environmentId, userId);
    if (env) {
      envVars = JSON.parse(env.variables);
    }
  }

  // 2️⃣ Resolve URL
  const resolvedUrl = resolveVariables(request.url, envVars);

  // 3️⃣ Resolve headers
  const headersFromDb = await getHeadersByRequestId(requestId);
  const headers = {};
  headersFromDb.forEach(h => {
    headers[h.key] = resolveVariables(h.value, envVars);
  });

  // 4️⃣ Resolve body
  let resolvedBody;
  if (request.body) {
    resolvedBody = JSON.parse(
      resolveVariables(request.body, envVars)
    );
  }

  const startTime = Date.now();

  try {
    // 5️⃣ Execute HTTP request
    const response = await axios({
      method: request.method,
      url: resolvedUrl,
      headers,
      data: resolvedBody,
      validateStatus: () => true,
    });

    const duration = Date.now() - startTime;

    // 6️⃣ SAVE EXECUTION (DO NOT REMOVE)
    await saveExecution({
      requestId,
      status: response.status,
      responseBody: response.data,
      responseHeaders: response.headers,
      duration,
    });

    return {
      status: response.status,
      headers: response.headers,
      data: response.data,
      duration,
    };
  } catch (err) {
    const duration = Date.now() - startTime;

    await saveExecution({
      requestId,
      status: null,
      responseBody: null,
      responseHeaders: null,
      duration,
      error: err.message,
    });

    throw err;
  }
};
