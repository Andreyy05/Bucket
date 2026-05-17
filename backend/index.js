import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware.js';

// ABL Imports
import categoryListAbl from './abl/category/listAbl.js';
import categoryCreateAbl from './abl/category/createAbl.js';
import goalListAbl from './abl/goal/listAbl.js';
import goalCreateAbl from './abl/goal/createAbl.js';
import goalUpdateAbl from './abl/goal/updateAbl.js';
import goalDeleteAbl from './abl/goal/deleteAbl.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CATEGORIES API ---
app.get('/api/categories', async (req, res, next) => {
  try {
    const response = await categoryListAbl.execute(req.query);
    res.json(response);
  } catch (e) { next(e); }
});

app.post('/api/categories', async (req, res, next) => {
  try {
    const response = await categoryCreateAbl.execute(req.body);
    res.status(201).json(response);
  } catch (e) { next(e); }
});

// --- GOALS API ---
app.get('/api/goals', async (req, res, next) => {
  try {
    const response = await goalListAbl.execute(req.query);
    res.json(response);
  } catch (e) { next(e); }
});

app.post('/api/goals', async (req, res, next) => {
  try {
    const response = await goalCreateAbl.execute(req.body);
    res.status(201).json(response);
  } catch (e) { next(e); }
});

app.put('/api/goals/:id', async (req, res, next) => {
  try {
    const response = await goalUpdateAbl.execute({ id: req.params.id, ...req.body });
    res.json(response);
  } catch (e) { next(e); }
});

app.delete('/api/goals/:id', async (req, res, next) => {
  try {
    const response = await goalDeleteAbl.execute({ id: req.params.id });
    res.json(response);
  } catch (e) { next(e); }
});

// Global Error Handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
