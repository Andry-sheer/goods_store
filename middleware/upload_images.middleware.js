import multer from "multer";
import path from 'path';
import { imageTypes } from "../config/mime_types.config.js";

const storage = multer.diskStorage({
  destination : (req, file, callBack)=> {
    callBack(null, 'uploads/')
  },
  filename : (req, file, callBack)=> {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callBack(null, unique + path.extname(file.originalname))
  }
});


const imageValidate = (req, file, callBack) => {
  const allowedFormat = /jpg|jpeg|png|svg|webp|heic|heif/;

  if (!imageTypes.includes(file.mimetype)) {
    return callBack(new Error(`Invalid file type. Allowed only: ${imageTypes.join(', ')}`));
  };

  const extnameValid = allowedFormat.test(path.extname(file.originalname).toLowerCase());
  if (!extnameValid) {
    return callBack(new Error('Invalid file extension'));
  }

  callBack(null, true);
};

export const uploadImages = multer({
  storage,
  limits : {
    fileSize: 10 * 1024 * 1024,
    files: 10
  },

  imageValidate
});

