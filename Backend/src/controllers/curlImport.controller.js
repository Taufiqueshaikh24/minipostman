import { importCurl } from '../services/curlImport.service.js';

export const importCurlController = async (req, res) => {
  try {
    const { name, curl } = req.body;

    if (!name || !curl) {
      return res.status(400).json({ message: 'name and curl are required' });
    }

    const requestId = await importCurl(req.userId, name, curl);

    res.status(201).json({
      message: 'cURL imported successfully',
      requestId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
