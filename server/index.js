import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import categoryListAbl from './abl/category/listAbl.js';
import categoryCreateAbl from './abl/category/createAbl.js';

// --- CATEGORIES API ---
app.get('/api/categories', async (req, res) => {
  try {
    const response = await categoryListAbl.execute(req.query);
    res.json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({
        code: error.code,
        message: error.message,
        params: error.params
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const response = await categoryCreateAbl.execute(req.body);
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({
        code: error.code,
        message: error.message,
        params: error.params
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

import listAbl from './abl/goal/listAbl.js';
import updateAbl from './abl/goal/updateAbl.js';
import createAbl from './abl/goal/createAbl.js';
import { CustomError } from './utils/errors.js';

app.get('/api/goals', async (req, res) => {
  try {
    const response = await listAbl.execute(req.query);
    res.json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({
        code: error.code,
        message: error.message,
        params: error.params
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/goals', async (req, res) => {
  try {
    const response = await createAbl.execute(req.body);
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({
        code: error.code,
        message: error.message,
        params: error.params
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.put('/api/goals/:id', async (req, res) => {
  try {
    const response = await updateAbl.execute({ id: req.params.id, ...req.body });
    res.json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({
        code: error.code,
        message: error.message,
        params: error.params
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.delete('/api/goals/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM goals WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
