import { NextFunction, Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import mongoose from 'mongoose';

import firebase from 'src/config/firebase';
import { FirebaseUser } from 'src/interfaces/firebase';
import Course from 'src/models/course';
import CourseUser, { RoleType } from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import User from 'src/models/user';

const unauthorizedMessage = 'Unauthorized. You must have permission to access.';

const getTokenDecoded = async (token: string) => {
  if (!token) {
    throw new CustomError(401, 'Unauthorized. Provide a token.');
  }

  let response: DecodedIdToken;
  try {
    response = await firebase.auth().verifyIdToken(token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.errorInfo?.code === 'auth/id-token-expired') {
      throw new CustomError(401, 'Unauthorized. Firebase ID token has expired.', {
        type: 'TOKEN_EXPIRED',
      });
    }
    throw new Error(error);
  }

  return response;
};

const superAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers;

  const response = await getTokenDecoded(String(token));
  if (response.userType !== 'SUPER_ADMIN') {
    throw new CustomError(401, unauthorizedMessage);
  }

  return next();
};

const normalUser = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers;

  const response = await getTokenDecoded(String(token));
  req.firebaseUid = response.uid;

  if (response.userType !== 'NORMAL') {
    throw new CustomError(401, unauthorizedMessage);
  }

  return next();
};

const accessBasedOnRoleAndType =
  ({ roles = [], types }: { roles?: RoleType[]; types: FirebaseUser['type'][] }) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const { token } = req.headers;
    const course = req.header('x-course');
    const response = await getTokenDecoded(String(token));

    if (!types.includes(response.userType)) {
      throw new CustomError(401, unauthorizedMessage);
    }

    if (response.userType === 'NORMAL') {
      const courseDoc = await Course.findOne({ _id: course });
      if (!mongoose.Types.ObjectId.isValid(String(course)) || !course || !courseDoc) {
        throw new CustomError(400, 'The course is invalid or does not exist.');
      }

      const user = await User.findOne({ firebaseUid: response.uid });
      const courseUser = await CourseUser.findOne({ user: user?._id, course });

      if (
        !user?.isActive ||
        (courseUser && (!roles.includes(courseUser.role) || !courseUser.isActive))
      ) {
        throw new CustomError(401, unauthorizedMessage);
      }
    }

    return next();
  };

export default { superAdmin, normalUser, accessBasedOnRoleAndType };
