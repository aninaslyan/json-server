import fs from "fs";
import { fileOption, apiUrl, imagePath } from "../constants";

const db = JSON.parse(fs.readFileSync('./db.json', fileOption).toString());

export class User {
  id;
  email;
  password;
  name;
  isAdmin;
  userImage;

  constructor(email, password, name = '', isAdmin = false, imageName) {
    this.id = db.users.length + 1;
    this.email = email;
    this.password = password;
    this.name = name;
    this.isAdmin = isAdmin;
    if (imageName) {
      this.userImage = `${apiUrl}/${imagePath}/${imageName}`;
    }
  }
}
