import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

app.use(express.json());

// Endpoint de salud para Cloud Run / health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Directorio dist con la build de Vite + Angular
const distPath = path.join(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { maxAge: '1h' }));

  // Fallback SPA para Angular Router (rutas como /tienda1, /tienda2/catalogo, etc.)
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Si se ejecuta sin compilar previamente, mostrar aviso descriptivo
  app.get('*', (_req, res) => {
    res.status(503).send('Compilando la aplicación... Por favor ejecuta npm run build.');
  });
}

app.listen(PORT, HOST, () => {
  console.log(`Servidor de producción ejecutándose en http://${HOST}:${PORT}`);
});
