import { Request, Response } from 'express';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

import firebase from 'src/config/firebase';
import { CustomError } from 'src/models/custom-error';
import SuperAdmin, { SuperAdminType } from 'src/models/super-admin';
import { paginateAndFilter } from 'src/utils/query';

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query, sort } = paginateAndFilter(req.query);
  const { docs, ...pagination } = await SuperAdmin.paginate(query, { page, limit, sort });
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

const create = async (req: Request, res: Response) => {
  let newFirebaseSuperAdmin: UserRecord;
  try {
    newFirebaseSuperAdmin = await firebase.auth().createUser({
      email: req.body.email,
      password: req.body.password,
    });
    await firebase
      .auth()
      .setCustomUserClaims(newFirebaseSuperAdmin.uid, { userType: 'SUPER_ADMIN' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.errorInfo?.code === 'auth/email-already-exists') {
      throw new CustomError(400, 'An super admin with this email already exists', {
        ...error,
        type: 'EMAIL_ALREADY_EXISTS',
      });
    }
    throw new CustomError(500, error.message, { ...error });
  }
  try {
    const newSuperadmin = new SuperAdmin<SuperAdminType>({
      firebaseUid: newFirebaseSuperAdmin.uid,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await firebase.auth().deleteUser(newFirebaseSuperAdmin.uid);
    throw new CustomError(500, error.message, { ...error });
  }
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

export default { getAll, physicalDeleteById, create };
