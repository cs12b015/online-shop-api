import 'reflect-metadata';
import { ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@databases';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, errorLogger } from '@utils/logger';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  private resolvers: any;
  private serverInstance: any;
  private dbConnection: any;

  constructor(resolvers) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.resolvers = resolvers;
  }

  private async listen() {
    this.serverInstance = this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`🎮 http://localhost:${this.port}/graphql`);
      logger.info(`=================================`);
    });
  }

  public async start() {
    this.initializeMiddlewares();
    await this.connectToDatabase();
    await this.initApolloServer(this.resolvers);
    this.initializeErrorHandling();
    await this.listen();
  }

  public getServer() {
    return this.app;
  }

  public async stop() {
    this.serverInstance.close();
    this.dbConnection.close();
  }

  private async connectToDatabase() {
    this.dbConnection = await createConnection(dbConnection);
    this.dbConnection.runMigrations();
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(hpp());
      this.app.use(helmet());
    }

    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private async initApolloServer(resolvers) {
    const schema = await buildSchema({
      resolvers: resolvers,
    });

    const apolloServer = new ApolloServer({
      schema: schema,
      plugins: [
        this.env === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ],
      formatResponse: response => {
        return response;
      },
      formatError: error => {
        errorLogger(error);
        return error;
      },
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app: this.app, cors: ORIGIN, path: '/graphql' });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
