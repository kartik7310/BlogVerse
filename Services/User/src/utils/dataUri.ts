import DataURIParser from 'datauri/parser.js';
import path from 'path';
import { Express } from 'express';

const getBuffer = (file: Express.Multer.File) => {
  const parser = new DataURIParser();

  const extName = path.extname(file.originalname).toString(); 

  const result = parser.format(extName, file.buffer);

  return result; // result has .content (base64 string) and .mimetype
};

export default getBuffer;
