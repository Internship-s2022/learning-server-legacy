import { Request, Response } from 'express';

import superAdminData from 'src/models/super-admin';
const getAllSuperadmins = async (req: Request, res: Response) => {
  try {
    if (req.query.id) {
      const superAdmin = await superAdminData.find({ _id: req.query.id });
      return res.status(200).json({
        message: 'Superadmin found',
        data: superAdmin,
        error: false,
      });
    }
    const allSuperadmins = await superAdminData.find({});
    return res.status(200).json({
      message: 'All Superadmins',
      data: allSuperadmins,
      error: false,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
      data: {},
      error: true,
    });
  }
};
const createSuperadmin = async (req: Request, res: Response) => {
  // let firebaseUid;
  try {
    // const newFirebaseEmployee = await Firebase.auth().createUser({
    //   email: req.body.email,
    // });

    // firebaseUid = newFirebaseEmployee.uid;
    // await Firebase.auth().setCustomUserClaims(newFirebaseEmployee.uid, { role: 'SUPERADMIN' });

    const newSuperadmin = new superAdminData({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      // firebaseUid,
      active: req.body.active,
    });
    const result = await newSuperadmin.save();
    return res.status(201).json({
      message: 'Superadmin created',
      data: result,
      error: false,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
      data: {},
      error: true,
    });
  }
};

export default {
  getAllSuperadmins,
  // getSuperAdminById,
  createSuperadmin,
  // updateSuperadmin,
  // deleteUser,
};
