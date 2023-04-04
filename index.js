import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import bodyParser from 'body-parser';
import companion from '@uppy/companion';
import crypto from 'crypto';
import fs from 'fs';

const dir = './tmp';
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir, { recursive: true });
}

const app = express();

app.use(bodyParser.json());

const options = {
  server: {
      host: `localhost:${process.env.PORT}`,
  },
  s3: {
    getKey: (req, filename) => `${process.env.BUCKET_FOLDER}/${crypto.randomUUID()}-${filename}`, // TODO: get folder from req
    key: process.env.COMPANION_AWS_KEY,
    secret: process.env.COMPANION_AWS_SECRET,
    bucket: process.env.COMPANION_AWS_BUCKET,
    region: process.env.COMPANION_AWS_REGION,
    endpoint: process.env.COMPANION_AWS_ENDPOINT,
    acl: "public-read",
  },
  filePath: '/tmp',
  secret: process.env.SECRET,
  uploadUrls: ['*'],
};

app.use('/companion', companion.app(options).app);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

companion.socket(server);