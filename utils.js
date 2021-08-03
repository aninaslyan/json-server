import fs from "fs";
import jwt from "jsonwebtoken";

import { expiresIn, fileOption, secret_key } from "./constants";

const db = JSON.parse(fs.readFileSync('./db.json', fileOption).toString());

export const findUserByEmail = (email) => {
    return db.users.find(user => user.email === email);
}

export const generateToken = (email, id, isAdmin, name) => {
  return jwt.sign(
    {
      id,
      email,
      name,
      isAdmin,
    },
    secret_key,
    {
      expiresIn
    }
  );
}

export const verifyToken = (token) => {
  return jwt.verify(token, secret_key);
}

export const authenticateByToken = (req, res) => {
  const bearerToken = req.headers['x-access-token'] || req.headers['authorization'];

  if (!bearerToken) {
    return res.status(401).json({
      message: "Authentication failed"
    });
  }

  const token = bearerToken.replace(/^Bearer\s+/, "");

  if (token) {
    jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      }
      req.decoded = decoded;
      // next();
    });
  } else {
    return res.status(401).json({
      message: "Authentication failed"
    });
  }
}
