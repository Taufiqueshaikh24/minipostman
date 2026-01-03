import {
  createEnv,
  listEnvs,
  getEnv,
  removeEnv,
} from '../services/environment.service.js';

export const createEnvironmentController = async (req, res) => {
  try {
    const id = await createEnv(req.userId, req.body);
    res.status(201).json({ id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getEnvironmentsController = async (req, res) => {
  try {
    const envs = await listEnvs(req.userId);
    res.json(envs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEnvironmentController = async (req, res) => {
  try {
    const env = await getEnv(req.params.id, req.userId);
    res.json(env);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteEnvironmentController = async (req, res) => {
  try {
    await removeEnv(req.params.id, req.userId);
    res.status(204).json({ message : "Enviroment has been deleted"});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
