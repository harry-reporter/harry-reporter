import Promise from 'bluebird';
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import onExit from 'signal-exit';
import { logger } from '../server-utils';
import App from './app';
import { MAX_REQUEST_SIZE } from './constants/server';
import { IArgs } from './index';

export default ({ paths, hermione, guiApi, configs }: IArgs) => {
  const { options, pluginConfig } = configs;
  const app = new App(paths, hermione, configs);
  const server = express();

  server.use(bodyParser.json({ limit: MAX_REQUEST_SIZE }));

  guiApi.initServer(server);

  server.use(
    express.static(path.join(__dirname, '../static'), { index: 'gui.html' }),
  );
  server.use(express.static(process.cwd()));
  server.use(
    '/images',
    express.static(path.join(process.cwd(), pluginConfig.path, 'images')),
  );

  server.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '../static', 'gui.html')),
  );

  server.get('/events', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });

    app.addClient(res);
  });

  server.get('/init', (req, res) => {
    res.json(app.data);
  });

  server.post('/run', (req, res) => {
    app.run(req.body).catch((err: Error) => {
      console.error('Error while trying to run tests', err);
    });

    res.sendStatus(200);
  });

  server.post('/update-reference', (req, res) => {
    app
      .updateReferenceImage(req.body)
      .then((updatedTests: any) => res.json(updatedTests))
      .catch(({ message }: { message: string }) =>
        res.status(500).send({ error: message }),
      );
  });

  onExit(() => {
    app.finalize();
    logger.log('server shutting down');
  });

  return app
    .initialize()
    .then(() => {
      return Promise.fromCallback((callback) => {
        server.listen(options.port, options.hostname, callback);
      });
    })
    .then(() => ({ url: `http://${options.hostname}:${options.port}` }));
};
