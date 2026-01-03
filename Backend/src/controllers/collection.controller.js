// src/controllers/collection.controller.js
import * as service from '../services/collection.service.js';

export const createCollectionController = async (req, res) => {
  try {
    const id = await service.create(req.userId, req.body);
    res.status(201).json({ id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCollectionsController = async (req, res) => {
  try {
    const collections = await service.list(req.userId);
    res.json(collections); // must return the array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCollectionController = async (req, res) => {
  try {
    await service.remove(req.userId, req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
