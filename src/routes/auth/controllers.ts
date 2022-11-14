import { Request, Response } from 'express';

import firebase from 'src/config/firebase';
import { CustomError } from 'src/models/custom-error';
import User from 'src/models/user';

const updatePassword = async (req: Request, res: Response) => {
  const user = await User.findOne({ firebaseUid: req.body.firebaseUid });
  if (user) {
    const updatedUser = await firebase
      .auth()
      .updateUser(req.body.firebaseUid, { password: req.body.newPassword });

    if (req.body.isNewUser) {
      await firebase.auth().setCustomUserClaims(req.body.firebaseUid, {
        ...updatedUser?.customClaims,
        isNewUser: false,
      });
      await User.findOneAndUpdate(
        { firebaseUid: req.body.firebaseUid },
        { ...user, isNewUser: false },
        { new: true },
      );
    }

    if (updatedUser) {
      return res.status(200).json({
        message: 'The user password has been successfully updated.',
        data: {
          uid: updatedUser.uid,
          email: updatedUser.email,
          userType: updatedUser?.customClaims?.userType,
        },
        error: false,
      });
    }
  } else {
    throw new CustomError(404, `User with firebase uid: ${req.body.firebaseUid} was not found.`);
  }
};

export default { updatePassword };
