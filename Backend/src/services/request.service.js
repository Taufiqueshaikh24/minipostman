import {
  createRequest,
  addHeaders,
  getRequestsByUser,
  deleteRequest as deleteRequestModel,
} from '../models/request.model.js';

export const saveRequest = async (userId, data) => {
  const { name, method, url, headers = [], body } = data;

  if (!name || !method || !url) {
    throw new Error('Name, method and URL are required');
  }

  const requestId = await createRequest(userId, { name, method, url, body });

  if (headers.length) {
    await addHeaders(requestId, headers);
  }

  return requestId;
};

export const getRequests = async (userId) => {
  return await getRequestsByUser(userId);
};

export const deleteRequest = async (requestId, userId) => {
  return await deleteRequestModel(requestId, userId);
};
