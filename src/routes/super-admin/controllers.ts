import { Request, Response } from 'express';

import firebase from 'src/config/firebase';
import { CustomError } from 'src/models/custom-error';
import SuperAdmin, { SuperAdminType } from 'src/models/super-admin';
import { paginateAndFilterByIncludes } from 'src/utils/query';

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query } = paginateAndFilterByIncludes(req.query);
  const { docs, ...pagination } = await SuperAdmin.paginate(query, { page, limit });
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of super admins.',
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find super admins.');
};

const getById = async (req: Request, res: Response) => {
  const superAdmin = await SuperAdmin.findById(req.params.id);
  if (superAdmin) {
    return res.status(200).json({
      message: 'The super admin has been successfully found.',
      data: superAdmin,
      error: false,
    });
  }
  throw new CustomError(404, `Could not found the super admin with id ${req.params.id}.`);
};

const create = async (req: Request, res: Response) => {
  const newFirebaseSuperAdmin = await firebase.auth().createUser({
    email: req.body.email,
    password: req.body.password,
  });
  const firebaseUid = newFirebaseSuperAdmin.uid;
  await firebase.auth().setCustomUserClaims(newFirebaseSuperAdmin.uid, { userType: 'SUPER_ADMIN' });
  const newSuperadmin = new SuperAdmin<SuperAdminType>({
    firebaseUid,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    isActive: true,
  });
  await newSuperadmin.save();
  return res.status(201).json({
    message: 'Super admin successfully created',
    data: newSuperadmin,
    error: false,
  });
};

const update = async (req: Request, res: Response) => {
  const updatedSuperAdmin = await SuperAdmin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (updatedSuperAdmin?.firebaseUid) {
    await firebase.auth().updateUser(updatedSuperAdmin.firebaseUid, {
      email: req.body.email,
      password: req.body.password,
    });
  }
  if (updatedSuperAdmin) {
    return res.status(200).json({
      message: 'The super admin has been successfully updated.',
      data: updatedSuperAdmin,
      error: false,
    });
  }
  throw new CustomError(404, `Superadmin with id: ${req.params.id} was not found.`);
};

const deleteById = async (req: Request, res: Response) => {
  const superAdmin = await SuperAdmin.findById(req.params.id);
  if (!superAdmin?.isActive) {
    throw new CustomError(400, 'This super admin has already been deleted.');
  }
  const result = await SuperAdmin.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    {
      new: true,
    },
  );
  if (result?.firebaseUid) {
    await firebase.auth().updateUser(result.firebaseUid, { disabled: true });
  }
  if (result) {
    return res.status(200).json({
      message: 'The super admin has been successfully deleted.',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Superadmin with id: ${req.params.id} was not found.`);
};

const physicalDeleteById = async (req: Request, res: Response) => {
  const result = await SuperAdmin.findByIdAndDelete(req.params.id);
  if (result?.firebaseUid) {
    await firebase.auth().deleteUser(result.firebaseUid);
    return res.status(200).json({
      message: `The super admin with id ${req.params.id} has been successfully deleted.`,
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Super admin with id ${req.params.id} was not found.`);
};

export default { getAll, update, deleteById, physicalDeleteById, create, getById };
