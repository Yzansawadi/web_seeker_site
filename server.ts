import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { runScheduleScraper } from './server/scraper';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // 1. Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 2. Web Scraper endpoint (matches extract_schedule.py)
  app.post('/api/scrape-schedule', async (req, res) => {
    try {
      const collegeId = (req.body && req.body.collegeId) || '1';
      console.log(`Starting live IUST scraper for collegeId=${collegeId}...`);
      const result = await runScheduleScraper(collegeId);
      console.log(`Scraper completed successfully: ${result.totalRows} rows extracted.`);
      res.json(result);
    } catch (error: any) {
      console.error('Scraper failed:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'حدث خطأ أثناء الاتصال بموقع الجامعة وسحب الجداول.',
      });
    }
  });

  // 3. Download/get current CSV from server
  app.get('/api/current-schedule-csv', (req, res) => {
    try {
      const csvPath = path.join(process.cwd(), 'IUST_schedule_full.csv');
      if (fs.existsSync(csvPath)) {
        const content = fs.readFileSync(csvPath, 'utf-8');
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.send(content);
      } else {
        res.status(404).json({ error: 'ملف الجدول غير موجود على الخادم' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IUST Schedule Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
