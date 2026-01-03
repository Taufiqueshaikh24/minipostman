import { executeRequest } from '../services/requestExecution.service.js';
import { getExecutionsByRequest } from '../models/requestExecution.model.js';

export const executeRequestController = async (req, res) => {
  try {
    const result = await executeRequest(
      req.params.id,
      req.userId
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getExecutionsController = async (req, res) => {
  try {
    const executions = await getExecutionsByRequest(req.params.id);
    res.json(executions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
