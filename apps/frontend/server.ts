import {AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse} from '@angular/ssr/node';
import express from 'express';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const angularApp = new AngularNodeAppEngine();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // server.use(
  //   '/api',
  //   createProxyMiddleware({
  //     target: 'http://localhost:3000',
  //     secure: false,
  //     changeOrigin: true,
  //   })
  // );

  /**
   * Serve static files from /browser
   */
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
      redirect: false,
    }),
  );

  /**
   * Handle all other requests by rendering the Angular application.
   */
  server.use((req, res, next) => {
    angularApp
      .handle(req)
      .then((response) =>
        response ? writeResponseToNodeResponse(response, res) : next(),
      )
      .catch(next);
  });

  return server;
}

function run(): express.Express {
  // Start up the Node server
  const server = app();
  if (isMainModule(import.meta.url)) {
    const port = process.env['PORT'] || 4000;

    server.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  }

  return server;
}

const serverApp = run();

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(serverApp);
