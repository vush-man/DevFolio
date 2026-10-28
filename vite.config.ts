import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Mock DevFlow backend server plugin matching project/src/app.js
function devflowBackendPlugin(): Plugin {
  return {
    name: 'devflow-backend-endpoints',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        
        if (url.startsWith('/api/devflow')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (url === '/api/devflow/health' || url.startsWith('/api/devflow/health?')) {
            res.statusCode = 200;
            res.end(JSON.stringify({
              status: 'healthy',
              service: 'devflow-core',
              version: '1.0.0',
              uptime: process.uptime(),
              timestamp: new Date().toISOString()
            }));
            return;
          }

          if (url.startsWith('/api/devflow/users/')) {
            const parts = url.split('?')[0].split('/');
            const id = parts[parts.length - 1] || '1';
            res.statusCode = 200;
            res.end(JSON.stringify({
              userId: id,
              name: `Engineer #${id}`,
              role: id === '1' ? 'admin' : 'member',
              department: 'Performance Lab',
              created_at: new Date(Date.now() - 86400000 * 30).toISOString()
            }));
            return;
          }

          if (url.startsWith('/api/devflow/search')) {
            res.statusCode = 200;
            res.end(JSON.stringify({
              query: url,
              totalResults: 142,
              items: [
                { id: 101, title: 'Database connection pool optimization', status: 'closed' },
                { id: 102, title: 'Investigate Redis cache miss latency', status: 'in-progress' },
                { id: 103, title: 'Benchmark async worker throughput', status: 'open' }
              ]
            }));
            return;
          }

          if (url === '/api/devflow/echo') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              res.statusCode = 200;
              let parsed = {};
              try { parsed = JSON.parse(body); } catch { parsed = { raw: body }; }
              res.end(JSON.stringify({ youSent: parsed, processedAt: Date.now() }));
            });
            return;
          }

          if (url.startsWith('/api/devflow/error-prone')) {
            // Generates 25% failure rate for error analysis demonstrations
            const fail = Math.random() < 0.25;
            if (fail) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Internal Server Error', code: 'DEVFLOW_DB_POOL_TIMEOUT' }));
            } else {
              res.statusCode = 200;
              res.end(JSON.stringify({ status: 'success', data: 'Processed through resilient fallback queue' }));
            }
            return;
          }

          if (url.startsWith('/api/devflow/slow')) {
            // Adds intentional 250ms latency for latency percentile demonstrations
            setTimeout(() => {
              res.statusCode = 200;
              res.end(JSON.stringify({ message: 'Response after synthetic database delay', latencyTargetMs: 250 }));
            }, 250);
            return;
          }

          // Default fallback
          res.statusCode = 200;
          res.end(JSON.stringify({ message: 'DevFlow API operational', endpoint: url }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devflowBackendPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
