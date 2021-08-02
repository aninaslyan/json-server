import bcrypt from "bcrypt";
import fs from "fs";
import express from "express";
import multer from "multer";

import { findUserByEmail, generateToken } from "../../utils";
import { fileOption, imagePath } from "../../constants";
import { User } from "../../models/user";

const router = express.Router();
const db = JSON.parse(fs.readFileSync('./db.json', fileOption).toString());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `./${imagePath}/`);
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const user = findUserByEmail(email);

  if (!user) {
    return res.status(404).json({
      error: "Invalid Credentials"
    });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }
    if (result) {
      const token = generateToken(user.email, user.id, user.isAdmin, user.name);

      return res.status(200).json({
        token,
        user,
      });
    }
    res.status(401).json({
      message: "Authentication failed"
    });
  });
});

router.post("/register", upload.single('userImage'), (req, res) => {
  const { email, password, name = '', isAdmin = false } = req.body;
  let imageName;

  if (req.file && req.file.filename) {
    imageName = req.file.filename;
  }

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const user = findUserByEmail(email);

  if (user) {
    return res.status(409).json({
      message: "Email already exists"
    });
  } else {
    bcrypt.hash(password, 10, (err, hashedPass) => {
      if (err) {
        return res.status(500).json({
          error: err
        });
      } else {
        const newUser = new User(email, hashedPass, name, isAdmin, imageName);

        db.users.push(newUser);
        const fileContent = JSON.stringify(db);

        fs.writeFile('./db.json', fileContent, fileOption, (error) => {
          if (error) {
            res.status(500).json({
              error: err
            });
          } else {
            res.status(201).json({
              user: newUser,
            });
          }
        });
      }
    });
  }
});

export default router;
