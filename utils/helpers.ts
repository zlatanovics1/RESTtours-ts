import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import crypto = require('crypto');

export function parseData(obj: any, fields: string, deleteFields?: boolean) {
  const fieldsArray = fields.split(' ');
  let outputObj: any = {};
  Object.keys(obj).forEach((key: string) => {
    if (deleteFields !== fieldsArray.includes(key))
      outputObj[key as keyof typeof outputObj] = obj[key as keyof typeof obj];
  });
  return outputObj;
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(
  enteredPassword: string,
  storedPassword: string,
) {
  return await bcrypt.compare(enteredPassword, storedPassword);
}

const verifyTokenPromise = (token: string, secret: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });

export async function verifyToken(token: string) {
  return (await verifyTokenPromise(token, process.env.JWT_SECRET!)) as any;
}

export const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');
