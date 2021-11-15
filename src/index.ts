import 'reflect-metadata';
import * as express from 'express';
import { config as envConfig } from 'dotenv';
import { connectDb } from '@config/Db';
import { UserRoutes } from '@routes/UserRoutes';
import { AuthRoutes } from '@routes/AuthRoutes';

envConfig();

const main = async () => {
  try {
    await connectDb();
    // create express app
    const app = express();
    app.use(express.json());
    app.listen(process.env.SERVER_PORT);
    app.use('', UserRoutes());
    app.use('', AuthRoutes());
    console.log(
      `Express server has started on port ${process.env.SERVER_PORT}`
    );
  } catch (e) {
    console.error(e);
  }
};

main();
