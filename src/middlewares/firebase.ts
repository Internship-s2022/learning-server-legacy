import { NextFunction, Request, Response } from 'express';

import firebase from '../config/firebase';

const superAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(400).json({ message: 'Provide a token' });
  }
  try {
    const response = await firebase.auth().verifyIdToken(String(token));
    req.body.firebaseUid = response.uid;

    if (response.userRole !== 'SUPER_ADMIN') {
      return res.status(400).json({
        message: 'Unauthorize. You must be an superadmin to access.',
        data: undefined,
        error: true,
      });
    }
    return next();
  } catch (error) {
    return res.status(400).json({
      message: 'Unauthorize. Provide a valid token',
      data: undefined,
      error: true,
    });
  }
};
const normalUser = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(400).json({ message: 'Provide a token' });
  }
  try {
    const response = await firebase.auth().verifyIdToken(String(token));
    req.body.firebaseUid = response.uid;

    if (response.userRole !== 'NORMAL') {
      return res.status(400).json({
        message: 'Unauthorize. You must be an normal user to access.',
        data: undefined,
        error: true,
      });
    }
    return next();
  } catch (error) {
    return res.status(400).json({
      message: 'Unauthorize. Provide a valid token',
      data: undefined,
      error: true,
    });
  }
};
export default { superAdmin, normalUser };
