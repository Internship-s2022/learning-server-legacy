import { NextFunction, Request, Response } from 'express';

import { CustomError } from 'src/models/custom-error';

import firebase from 'src/config/firebase';

const superAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers;
  if (!token) {
    throw new CustomError(401, 'Unauthorized. Provide a token');
  }

  const response = await firebase.auth().verifyIdToken(String(token));
  req.body.firebaseUid = response.uid;

  if (response.userRole !== 'SUPER_ADMIN') {
    throw new CustomError(401, 'Unauthorized. You must be an superadmin to access.');
  }
  return next();
};

const normalUser = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers;
  if (!token) {
    throw new CustomError(401, 'Unauthorized. Provide a token');
  }

  const response = await firebase.auth().verifyIdToken(String(token));
  req.body.firebaseUid = response.uid;

  if (response.userRole !== 'NORMAL') {
    throw new CustomError(401, 'Unauthorized. You must be an normal user to access.');
  }
  return next();
};

export default { superAdmin, normalUser };
