import { Request, Response } from 'express';

import firebase from 'src/config/firebase';
import CourseUser from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import User from 'src/models/user';

const updatePassword = async (req: Request, res: Response) => {
  const user = await User.findOne({ firebaseUid: req.body.firebaseUid, isActive: true });
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

const getMeInfo = async (req: Request, res: Response) => {
  const userUID = req.firebaseUid;
  const user = await User.findOne({ firebaseUid: userUID }).populate({ path: 'postulant' });
  if (user?._id) {
    const currentCourses = await CourseUser.find({ user: user._id }).populate({ path: 'course' });
    const userInfo = {
      currentUser: user,
      courses: currentCourses,
    };
    if (currentCourses.length) {
      return res.status(200).json({
        message: `The user info with uid: ${req.params.uid} has been successfully found.`,
        data: userInfo,
        error: false,
      });
    }
    throw new CustomError(400, 'This user does not belong to any course.');
  }
  throw new CustomError(404, `User with uid ${req.params.uid} was not found.`);
};

export default { updatePassword, getMeInfo };
