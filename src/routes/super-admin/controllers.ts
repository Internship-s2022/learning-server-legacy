import { Request, Response } from 'express';

import Firebase from 'src/config/firebase';
import { CustomError } from 'src/models/custom-error';
import SuperAdmin, { SuperAdminType } from 'src/models/super-admin';

const getAll = async (req: Request, res: Response) => {
  const allSuperAdmins = await SuperAdmin.find(req.query);
  if (allSuperAdmins.length) {
    return res.status(200).json({
      message: 'Showing the list of super admins',
      data: allSuperAdmins,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find super admins');
};

const getById = async (req: Request, res: Response) => {
  const superAdmin = await SuperAdmin.findById(req.params.id);
  if (superAdmin) {
    return res.status(200).json({
      message: 'The super admin has been successfully found',
      data: superAdmin,
      error: false,
    });
  }
  throw new CustomError(404, `Could not found the super admin with id ${req.params.id}`);
};

const create = async (req: Request, res: Response) => {
  try {
    const newFirebaseSuperAdmin = await Firebase.auth().createUser({
      email: req.body.email,
      password: req.body.password,
    });
    const firebaseUid = newFirebaseSuperAdmin.uid;
    await Firebase.auth().setCustomUserClaims(newFirebaseSuperAdmin.uid, { role: 'SUPERADMIN' });
    const newSuperadmin = new SuperAdmin<SuperAdminType>({
      firebaseUid,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      isActive: req.body.isActive,
    });

    await newSuperadmin.save();
    return res.status(201).json({
      message: 'Super admin successfully created',
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

const update = async (req: Request, res: Response) => {
  const updatedSuperAdmin = await SuperAdmin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (updatedSuperAdmin) {
    return res.status(200).json({
      message: 'The super admin has been successfully updated',
      data: updatedSuperAdmin,
      error: false,
    });
  }
  throw new CustomError(404, `Superadmin with id: ${req.params.id} was not found`);
};

const deleteById = async (req: Request, res: Response) => {
  const superAdmin = await SuperAdmin.findById(req.params.id);
  if (superAdmin?.isActive === false) {
    throw new CustomError(404, 'Super Admin has already been deleted');
  }
  const result = await SuperAdmin.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    {
      new: true,
    },
  );
  if (result) {
    return res.status(200).json({
      message: 'The super admin has been successfully deleted',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Superadmin with id: ${req.params.id} was not found`);
};

export default { getAll, update, deleteById, create, getById };
