// src/services/collection.service.js
import {
    createCollection,
    getCollectionsByUser,
    deleteCollection,
} from '../models/collection.model.js';

export const create = async (userId, data) => {
    if (!data.name) throw new Error('Collection name required');
    return await createCollection(userId, data.name, data.description);
};

export const list = async (userId) => {
    const collections = await getCollectionsByUser(userId);
    console.log('Collections for user:', userId, collections);
    return collections; // make sure we actually return this
};

export const remove = async (userId, id) =>
    await deleteCollection(id, userId);
