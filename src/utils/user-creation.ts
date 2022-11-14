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

const userCreation = async (req: Request, postulantId: mongoose.Types.ObjectId) => {
  const newPassword = generatePassword(24);
  let firebaseUid: string;
  const email = req.body.email;
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
    if (!req.body.postulant) await Postulant.findByIdAndDelete(postulantId);
    throw new CustomError(400, err.message, { ...err });
  }
  let newMongoUser: UserDocument;
  try {
    newMongoUser = new User<UserType>({
      firebaseUid,
      email,
      postulant: postulantId,
      isInternal: req.body.isInternal,
      isActive: req.body.isActive,
      isNewUser: true,
    });
    await newMongoUser.save();
  } catch (err: any) {
    if (!req.body.postulant) await Postulant.findByIdAndDelete(postulantId);
    await firebase.auth().deleteUser(firebaseUid);
    throw new CustomError(500, err.message, { ...err, type: 'USER_MONGO_ERROR' });
  }

  await sendEmail(
    req.body.email,
    sendgridTemplates.sendUserCredentials,
    {
      email: req.body.email,
      password: newPassword,
    },
    async (err: any) => {
      if (err) {
        if (!req.body.postulant) await Postulant.findByIdAndDelete(postulantId);
        await User.findByIdAndDelete(newMongoUser._id);
        await firebase.auth().deleteUser(firebaseUid);
        throw new CustomError(500, err.message, { ...err, type: 'SENDGRID_ERROR' });
      }
    },
  );
  return newMongoUser;
};

export default userCreation;
