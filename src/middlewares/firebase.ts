import { NextFunction, Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import firebase from 'src/config/firebase';
import { CustomError } from 'src/models/custom-error';

const superAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers;
  if (!token) {
    throw new CustomError(401, 'Unauthorized. Provide a token.');
  }

  let response: DecodedIdToken;
  try {
    response = await firebase.auth().verifyIdToken(String(token));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.errorInfo?.code === 'auth/id-token-expired') {
      throw new CustomError(401, 'Unauthorized. Firebase ID token has expired.', {
        type: 'TOKEN_EXPIRED',
      });
    }
    throw new Error(error);
  }

  if (response.userType !== 'SUPER_ADMIN') {
    throw new CustomError(401, 'Unauthorized. You must have permission to access.');
  }

  return next();
};

const normalUser = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers;
  // const { uid } = req.firebaseUid;
  if (!token) {
    throw new CustomError(401, 'Unauthorized. Provide a token.');
  }
  let response: DecodedIdToken;
  try {
    response = await firebase.auth().verifyIdToken(String(token));
    req.firebaseUid = response.uid;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.errorInfo?.code === 'auth/id-token-expired') {
      throw new CustomError(401, 'Unauthorized. Firebase ID token has expired.', {
        type: 'TOKEN_EXPIRED',
      });
    }
    throw new Error(error);
  }

  if (response.userType !== 'NORMAL') {
    throw new CustomError(401, 'Unauthorized. You must have permission to access.');
  }

  return next();
};

export default { superAdmin, normalUser };
