import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname safely in ES Modules so server runs from any working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);