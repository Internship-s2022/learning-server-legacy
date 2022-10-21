import { Request, Response } from 'express';

import firebase from 'src/config/firebase';
import { CustomError } from 'src/models/custom-error';

const updatePassword = async (req: Request, res: Response) => {
  const updatedUser = await firebase
    .auth()
    .updateUser(req.body.firebaseUid, { password: req.body.password });

  if (updatedUser) {
    return res.status(200).json({
      message: 'The user password has been successfully updated',
      data: {
        uid: updatedUser.uid,
        email: updatedUser.email,
        userType: updatedUser?.customClaims?.userType,
      },
      error: false,
    });
  }
  throw new CustomError(404, `User with firebase uid: ${req.body.firebaseUid} was not found`);
};

export default { updatePassword };
