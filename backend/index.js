import express from 'express';
import cors from 'cors';
import { db } from './db.js';

import categoryListAbl from './abl/category/listAbl.js';
import categoryCreateAbl from './abl/category/createAbl.js';
import categoryDeleteAbl from './abl/category/deleteAbl.js';
import listAbl from './abl/goal/listAbl.js';
import updateAbl from './abl/goal/updateAbl.js';
import createAbl from './abl/goal/createAbl.js';
import deleteAbl from './abl/goal/deleteAbl.js';
import exportAbl from './abl/backup/exportAbl.js';
import importAbl from './abl/backup/importAbl.js';
import { CustomError } from './utils/errors.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CATEGORIES API ---
app.get('/api/categories', async (req, res, next) => {
  try {
    res.json(await categoryListAbl.execute(req.query));
  } catch (error) {
    next(error);
  }
});

app.post('/api/categories', async (req, res, next) => {
  try {
    res.status(201).json(await categoryCreateAbl.execute(req.body));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/categories/:id', async (req, res, next) => {
  try {
    res.json(await categoryDeleteAbl.execute({ id: req.params.id }));
  } catch (error) {
    next(error);
  }
});

// --- GOALS API ---
app.get('/api/goals', async (req, res, next) => {
  try {
    res.json(await listAbl.execute(req.query));
  } catch (error) {
    next(error);
  }
});

app.post('/api/goals', async (req, res, next) => {
  try {
    res.status(201).json(await createAbl.execute(req.body));
  } catch (error) {
    next(error);
  }
});

app.put('/api/goals/:id', async (req, res, next) => {
  try {
    res.json(await updateAbl.execute({ id: req.params.id, ...req.body }));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/goals/:id', async (req, res, next) => {
  try {
    res.json(await deleteAbl.execute({ id: req.params.id }));
  } catch (error) {
    next(error);
  }
});

// --- BACKUP & RESTORE API ---
app.get('/api/backup/export', async (req, res, next) => {
  try {
    res.json(await exportAbl.execute());
  } catch (error) {
    next(error);
  }
});

app.post('/api/backup/import', async (req, res, next) => {
  try {
    res.json(await importAbl.execute(req.body));
  } catch (error) {
    next(error);
  }
});

// --- Centrální Error Handler ---
app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.status).json({
      code: err.code,
      message: err.message,
      params: err.params
    });
  } else {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: err.message || 'Interní chyba serveru.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
