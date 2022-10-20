import { Request } from 'express';
import mongoose from 'mongoose';

import firebase from 'src/config/firebase';
import sendgridTemplates from 'src/constants/sendgrid-templates';
import User, { UserType } from 'src/models/user';

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

const userCreation = async (req: Request, postulantId: mongoose.Types.ObjectId) => {
  const newPassword = generatePassword(24);
  const newFirebaseUser = await firebase.auth().createUser({
    email: req.body.email,
    password: newPassword,
  });
  const firebaseUid = newFirebaseUser.uid;
  await firebase.auth().setCustomUserClaims(newFirebaseUser.uid, { userType: 'NORMAL' });

  let newMongoUser;
  try {
    newMongoUser = new User<UserType>({
      firebaseUid,
      postulantId: postulantId,
      isInternal: req.body.isInternal,
      isActive: req.body.isActive,
    });
    await newMongoUser.save();
  } catch (err: any) {
    await firebase.auth().deleteUser(firebaseUid);
    throw new Error(err.message);
  }

  await sendEmail(
    req.body.email,
    sendgridTemplates.sendUserCredentials,
    {
      email: req.body.email,
      password: newPassword,
    },
    async (err: any, result) => {
      if (err) {
        await firebase.auth().deleteUser(firebaseUid);
        throw new Error(`Sendgrid error: ${err.message}`);
      }
    },
  );
  return newMongoUser;
};

export default userCreation;
