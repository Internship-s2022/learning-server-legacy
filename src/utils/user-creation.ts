import { Request } from 'express';
import mongoose from 'mongoose';

import firebase from 'src/config/firebase';
import sendgridTemplates from 'src/constants/sendgrid-templates';
import { CustomError } from 'src/models/custom-error';
import Postulant from 'src/models/postulant';
import User, { UserDocument, UserType } from 'src/models/user';

import sendEmail from './send-email';
export const generatePassword = (length: number) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomPassword = '';
  for (let i = 0; i <= length; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    randomPassword += chars.substring(randomNumber, randomNumber + 1);
  }
  return randomPassword;
};

const userCreation = async (req: Request, postulantId: string, promotion = false, timeout = 1) => {
  const newPassword = generatePassword(24);
  let firebaseUid: string;
  const email = req.body.email;
  let newMongoUser: UserDocument;
  return new Promise(
    (
      resolve: (value: {
        newMongoUser: UserDocument;
        credentials: { email: string; newPassword: string; firebaseUid: string };
      }) => void,
      reject,
    ) =>
      setTimeout(async () => {
        try {
          const newFirebaseUser = await firebase.auth().createUser({
            email,
            password: newPassword,
          });
          firebaseUid = newFirebaseUser.uid;
          await firebase
            .auth()
            .setCustomUserClaims(newFirebaseUser.uid, { userType: 'NORMAL', isNewUser: true });
        } catch (err: any) {
          if (!req.body.postulant && !promotion) await Postulant.findByIdAndDelete(postulantId);
          if (err?.errorInfo?.code === 'auth/email-already-exists') {
            reject(
              new CustomError(400, 'The email address is already in use by another account', {
                ...err,
                type: 'EMAIL_ALREADY_EXISTS',
              }),
            );
            return;
          }
          reject(new CustomError(500, err.message, { ...err }));
          return;
        }
        try {
          newMongoUser = new User<UserType>({
            firebaseUid,
            email,
            postulant: new mongoose.Types.ObjectId(postulantId),
            isInternal: promotion ? false : req.body.isInternal,
            isActive: promotion ? true : req.body.isActive,
            isNewUser: true,
          });
          await newMongoUser.save();
        } catch (err: any) {
          if (!req.body.postulant && !promotion) await Postulant.findByIdAndDelete(postulantId);
          await firebase.auth().deleteUser(firebaseUid);
          reject(new CustomError(500, err.message, { ...err, type: 'USER_MONGO_ERROR' }));
          return;
        }
        if (!promotion)
          await sendEmail(
            req.body.email,
            sendgridTemplates.sendUserCredentials,
            {
              email: req.body.email,
              password: newPassword,
            },
            async (err: any) => {
              if (err) {
                if (!req.body.postulant && !promotion)
                  await Postulant.findByIdAndDelete(postulantId);
                await User.findByIdAndDelete(newMongoUser._id);
                await firebase.auth().deleteUser(firebaseUid);
                reject(new CustomError(500, err.message, { ...err, type: 'SENDGRID_ERROR' }));
                return;
              }
            },
          );
        resolve({ newMongoUser, credentials: { email, newPassword, firebaseUid } });
        return;
      }, timeout),
  );
};

export default userCreation;
