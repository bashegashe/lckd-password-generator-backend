import { db } from '@/services/db';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
export function checkPassword(password, encryptedPassword) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, process.env.SECRET_KEY);
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
  return password === originalPassword;
}
export function encryptPassword(password) {
  return CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
}
export async function getUser(username) {
  const { Item } = await db
    .get({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: username,
        SK: username,
      },
    })
    .promise();

  return Item;
}

export function generateToken(username) {
  return jwt.sign({ username }, process.env.SECRET_KEY, {
    expiresIn: '1h',
    algorithm: 'HS256',
  });
}
export function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET_KEY, {
    algorithm: 'HS256',
  });
}
