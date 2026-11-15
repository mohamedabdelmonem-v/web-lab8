import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname safely in ES Modules so server runs from any working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Hard-coded data constants
const COURSES = [
  { id: 101, title: 'Web Architecture & HTTP', credits: 6 },
  { id: 102, title: 'Modern Frontend Development', credits: 6 },
  { id: 103, title: 'Backend Systems with Node.js', credits: 6 }
];

let requestsServed = 0;

// --- MIDDLEWARE (Registered before routes) ---

// 1. Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// 2. Request Counter
app.use((req, res, next) => {
  requestsServed += 1;
  next();
});

// --- STATIC FILES ---
// Serves index.html at GET / along with styles.css and app.js
app.use(express.static(path.join(__dirname, 'public')))