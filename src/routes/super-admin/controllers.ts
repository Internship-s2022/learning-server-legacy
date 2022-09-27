import { Request, Response } from 'express';

import superAdminData from 'src/models/super-admin';
const getAllSuperAdmins = async (req: Request, res: Response) => {
  try {
    if (req.query.id) {
      const superAdmin = await superAdminData.find({ _id: req.query.id });
      return res.status(200).json({
        message: 'Superadmin found',
        data: superAdmin,
        error: false,
      });
    }
    if (req.query.isActive) {
      const superAdmin = await superAdminData.find({ isActive: req.query.isActive });
      return res.status(200).json({
        message: `Superadmins ${req.query.isActive} types found`,
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
const updateSuperadmin = async (req: Request, res: Response) => {
  try {
    if (!req.params) {
      return res.status(400).json({
        message: 'You must specify an id',
        data: {},
        error: true,
      });
    }
    const { id } = req.params;
    const updatedAdmin = await superAdminData.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({
        message: `Superadmin with id:${req.params.id} not found`,
        data: {},
        error: true,
      });
    }
    // if (updatedAdmin.firebaseUid) {
    //   Firebase.auth().updateUser(updatedAdmin.firebaseUid, {
    //     email: req.body.email,
    //     password: req.body.password,
    //   });
    // }
    return res.status(200).json({
      message: 'The super admin has been updated successfully',
      data: updatedAdmin,
      error: false,
    });
  } catch (error) {
    return res.status(400).json({
      message: [error, `Superadmin with id:${req.params.id} not found`],
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
      isActive: req.body.isActive,
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
const deleteSuperadminById = async (req: Request, res: Response) => {
  try {
    if (!req.params) {
      return res.status(404).json({
        message: 'You must specify an id',
        data: {},
        error: true,
      });
    }

    const deletedDoc = await superAdminData.findByIdAndDelete(req.params.id);

    if (!deletedDoc) {
      return res.status(404).json({
        message: `There is no Superadmin with _id:${req.params.id}`,
        data: {},
        error: true,
      });
    }
    // if (deletedDoc.firebaseUid) {
    //   await Firebase.auth().deleteUser(deletedDoc.firebaseUid);
    // }
    return res
      .json({
        message: 'User eliminated',
        data: deletedDoc,
        error: false,
      })
      .status(204);
  } catch (error) {
    return res.status(400).json({
      message: [error, { id: req.params.id }],
      data: {},
      error: true,
    });
  }
};

export default {
  getAllSuperAdmins,
  updateSuperadmin,
  deleteSuperadminById,
  createSuperadmin,
};
