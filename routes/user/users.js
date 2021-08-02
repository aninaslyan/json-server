import fs from "fs";
import express from "express";
import http from "http";

import { fileOption } from "../../constants";
import { authenticateByToken } from "../../utils";

const router = express.Router();
const db = JSON.parse(fs.readFileSync('./db.json', fileOption).toString());

router.get("/", (req, res, next) => {
  authenticateByToken(req, res, next);
  const userToken = req.decoded;

  const { isAdmin } = userToken;

  if (isAdmin) {
    return res.status(200).json({
      users: db.users
    });
  }
  return res.status(401).json({
    message: 'Unauthorized'
  });

});

router.post("/", (req, res, next) => {
  authenticateByToken(req, res, next);
  const userToken = req.decoded;

  const { isAdmin } = userToken;

  // if (isAdmin) {
  //   var url="http://localhost:5000/register";
  //   var req = http.request(url,res=>{
  //     // comment out, because in my environment this causes error
  //     // body=JSON.stringify(res);
  //     // console.log(body);
  //     res.on('data', (chunk) => {
  //       console.log(`BODY: ${chunk}`);
  //     });
  //   });
  // } else {
  //   return res.status(401).json({
  //     message: 'Unauthorized'
  //   });
  // }
});

export default router;
