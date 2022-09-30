import { Request, Response } from 'express';

import SuperAdmin, { SuperAdminTypes } from 'src/models/super-admin';

const getAllSuperAdmins = async (req: Request, res: Response) => {
  try {
    if (req.query.isActive) {
      const allSuperAdmins = await SuperAdmin.find({ isActive: req.query.isActive });
      if (allSuperAdmins.length) {
        return res.status(200).json({
          message: 'Showing the list of active super admins',
          data: allSuperAdmins,
          error: false,
        });
      }
      return res.status(404).json({
        message: 'Cannot find active super admins.',
        data: undefined,
        error: true,
      });
    }
    const allSuperAdmins = await SuperAdmin.find({});
    if (allSuperAdmins.length) {
      return res.status(200).json({
        message: 'Showing all the super admins',
        data: allSuperAdmins,
        error: false,
      });
    }
    return res.status(404).json({
      message: 'Cannot show the list of all super admins.',
      data: undefined,
      error: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: `Something went wrong: ${error.message}`,
      data: undefined,
      error: true,
    });
  }
};

const getSuperadminById = async (req: Request, res: Response) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.params.id);
    if (!superAdmin) {
      return res.status(404).json({
        message: `Could not found the super admin with id ${req.params.id}`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'The super admin has been found successfully',
      data: superAdmin,
      error: false,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: `Something went wrong: ${error.message}`,
      data: undefined,
      error: true,
    });
  }
};

const createSuperAdmin = async (req: Request, res: Response) => {
  try {
    const newSuperadmin = new SuperAdmin<SuperAdminTypes>({
      firebaseUid: req.body.firebaseUid,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      isActive: req.body.isActive,
    });
    await newSuperadmin.save();
    return res.status(201).json({
      message: 'Super admin created successfully',
      data: newSuperadmin,
      error: false,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: `Something went wrong: ${error.message}`,
      data: undefined,
      error: true,
    });
  }
};

const updateSuperAdmin = async (req: Request, res: Response) => {
  try {
    const updatedSuperAdmin = await SuperAdmin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedSuperAdmin) {
      return res.status(404).json({
        message: `Superadmin with id: ${req.params.id} was not found`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'The super admin has been updated successfully',
      data: updatedSuperAdmin,
      error: false,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: `Something went wrong: ${error.message}`,
      data: undefined,
      error: true,
    });
  }
};

const deleteSuperAdmin = async (req: Request, res: Response) => {
  try {
    const result = await SuperAdmin.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      {
        new: true,
      },
    );
    if (!result) {
      return res.status(404).json({
        message: `Superadmin with id: ${req.params.id} was not found`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'The super admin has been successfully deleted',
      data: result,
      error: false,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: `Something went wrong: ${error.message}`,
      data: undefined,
      error: true,
    });
  }
};

export default {
  getAllSuperAdmins,
  updateSuperAdmin,
  deleteSuperAdmin,
  createSuperAdmin,
  getSuperadminById,
};
