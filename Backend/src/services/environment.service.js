import {
  createEnvironment,
  getEnvironmentsByUser,
  getEnvironmentById,
  deleteEnvironment,
} from '../models/environment.model.js';

export const createEnv = async (userId, payload) => {
  const { name, variables } = payload;

  if (!name || typeof variables !== 'object') {
    throw new Error('Invalid environment data');
  }

  return await createEnvironment(userId, name, variables);
};

export const listEnvs = async (userId) => {
  const envs = await getEnvironmentsByUser(userId);

  return envs.map(env => ({
    ...env,
    variables: JSON.parse(env.variables),
  }));
};

export const getEnv = async (envId, userId) => {
  const env = await getEnvironmentById(envId, userId);
  if (!env) throw new Error('Environment not found');

  return {
    ...env,
    variables: JSON.parse(env.variables),
  };
};

export const removeEnv = async (envId, userId) => {
  return await deleteEnvironment(envId, userId);
};
