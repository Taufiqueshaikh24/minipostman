import { saveRequest, getRequests, deleteRequest } from '../services/request.service.js';

export const saveRequestController = async (req, res) => {
  try {
    const requestId = await saveRequest(req.userId, req.body);
    res.status(201).json({ requestId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getRequestsController = async (req, res) => {
  try {
    const requests = await getRequests(req.userId);
    res.json(requests);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteRequestController = async (req, res) => {
  try {
    await deleteRequest(req.params.id, req.userId);
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
