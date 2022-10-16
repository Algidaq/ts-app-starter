import 'reflect-metadata';
import express from 'express';
import * as http from 'http';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
// import { CommonRoutesConfig } from './common/common.route.config';
import debug from 'debug';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { Logger } from './utils/Logger';
import { BaseRoutesConfig } from './base/BaseRouteConfig';
import UserRoutes from './modules/user/UserRoutes';

const result = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

if (result.error) {
  throw result.error;
}

const app: express.Application = express();
const server: http.Server = http.createServer(app);

const port = Number.parseInt(process.env.PORT ?? '3000');
const debugLog: debug.IDebugger = debug('app');

Logger.info(process.env.NODE_ENV);

app.use(helmet());
app.use(express.json());

app.use(
  cors({
    exposedHeaders: [],
  })
);

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (process.env.NODE_ENV !== 'development') {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
// routes.push(new UsersRoutes(app));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send({
    message: runningMessage,
    processInfo: {
      upTime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      memoryUsage: process.memoryUsage,
    },
  });
});

async function setup() {
  try {
    /// initlize database

    /// add Routes
    const routes: BaseRoutesConfig<any>[] = [];
    routes.push(new UserRoutes(app));
    server.listen(port, async () => {
      routes.forEach((route: BaseRoutesConfig<any>) => {
        Logger.info(`Routes configured for ${route.name} ${route.route}`);
      });
      // our only exception to avoiding console.log(), because we
      // always want to know when the server is done starting up
      Logger.info(runningMessage);
    });
  } catch (e) {
    Logger.error('erorr', [e]);
  }
}

setup();
