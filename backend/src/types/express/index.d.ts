import 'express';
import { File as MulterFile } from 'multer';

declare module 'express' {
  export interface Request {
    file?: MulterFile;
  }
}
