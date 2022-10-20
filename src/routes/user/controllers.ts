import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';

import firebase from 'src/config/firebase';
import { CustomError } from 'src/models/custom-error';
import Postulant from 'src/models/postulant';
import User, { UserType } from 'src/models/user';
import { filterByIncludes, paginateAndFilterByIncludes } from 'src/utils/query';

const getAllUsers = async (req: Request, res: Response) => {
  const { page, limit, query } = paginateAndFilterByIncludes(req.query);
  const { docs, ...pagination } = await User.paginate(query, {
    page,
    limit,
    populate: { path: 'postulantId' },
  });
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of users',
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of users.');
};

const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).populate({ path: 'postulantId' });
  if (user) {
    return res.status(200).json({
      message: 'The user has been successfully found',
      data: user,
      error: false,
    });
  }
  throw new CustomError(404, `Could not found the user with id ${req.params.id}`);
};

const create = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.body.postulantId);
  if (postulant) {
    const newFirebaseUser = await firebase.auth().createUser({
      email: req.body.email,
      password: req.body.password,
    });
    const firebaseUid = newFirebaseUser.uid;
    await firebase.auth().setCustomUserClaims(newFirebaseUser.uid, { userType: 'NORMAL' });
    try {
      const newUser = new User<UserType>({
        firebaseUid,
        postulantId: req.body.postulantId,
        isInternal: req.body.isInternal,
        isActive: req.body.isActive,
      });
      await newUser.save();
      return res.status(201).json({
        message: 'User successfully created',
        data: newUser,
        error: false,
      });
    } catch (err: any) {
      firebase.auth().deleteUser(firebaseUid);
      throw Error(err.message);
    }
  } else {
    throw new CustomError(
      400,
      `The postulant with the id of ${req.body.postulantId} does not exist`,
    );
  }
};

const update = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.body.postulantId);
  if (postulant) {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedUser?.firebaseUid) {
      await firebase.auth().updateUser(updatedUser.firebaseUid, {
        email: req.body.email,
        password: req.body.password,
      });
    }
    if (updatedUser) {
      return res.status(200).json({
        message: 'The user has been successfully updated',
        data: updatedUser,
        error: false,
      });
    }
    throw new CustomError(404, `User with id: ${req.params.id} was not found`);
  } else {
    throw new CustomError(
      400,
      `The postulant with the id of ${req.body.postulantId} does not exist`,
    );
  }
};

const deleteById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user?.isActive === false) {
    throw new CustomError(404, 'The user has already been deleted');
  }
  const result = await User.findByIdAndUpdate(
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
      message: 'The user has been successfully deleted',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `User with id: ${req.params.id} was not found`);
};

const exportToCsv = async (req: Request, res: Response) => {
  const query = filterByIncludes(req.query);
  const docs = await User.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'postulants',
        localField: 'postulantId',
        foreignField: '_id',
        as: 'postulant',
      },
    },
    { $project: { postulantId: 0 } },
    { $unwind: { path: '$postulant' } },
  ]);
  if (docs.length) {
    const csv = await parseAsync(docs, {
      fields: [
        '_id',
        'isInternal',
        'isActive',
        'postulant._id',
        'postulant.firstName',
        'postulant.lastName',
        'postulant.birthDate',
        'postulant.location',
        'postulant.dni',
        'postulant.phone',
        'postulant.email',
      ],
    });
    if (csv) {
      res.set('Content-Type', 'text/csv');
      res.attachment('users.csv');
      return res.status(200).send(csv);
    }
  }
  throw new CustomError(404, 'Cannot find the list of users.');
};

export default {
  getAllUsers,
  getUserById,
  create,
  update,
  deleteById,
  exportToCsv,
};
