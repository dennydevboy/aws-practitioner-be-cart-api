import { Callback, Context, Handler } from 'aws-lambda';
import { json, text } from 'express';
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';

import { AppModule } from './app.module';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(text());
  app.use(json());

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());

  return server(event, context, callback);
};
