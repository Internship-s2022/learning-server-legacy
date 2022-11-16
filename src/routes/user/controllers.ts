import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';
import mongoose from 'mongoose';

import firebase from 'src/config/firebase';
import { CustomError } from 'src/models/custom-error';
import Postulant, { PostulantType } from 'src/models/postulant';
import User from 'src/models/user';
import { filterByIncludes, paginateAndFilterByIncludes } from 'src/utils/query';
import userCreation from 'src/utils/user-creation';

const getUserPipeline = (query: qs.ParsedQs) => [
  {
    $lookup: {
      from: 'postulants',
      localField: 'postulant',
      foreignField: '_id',
      as: 'postulant',
    },
  },
  { $unwind: { path: '$postulant' } },
  { $match: query },
];

const getAllUsers = async (req: Request, res: Response) => {
  const { page, limit, query } = paginateAndFilterByIncludes(req.query);
  const userAggregate = User.aggregate(getUserPipeline(query));
  const { docs, ...pagination } = await User.aggregatePaginate(userAggregate, {
    page,
    limit,
  });
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of users.',
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of users.');
};

const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).populate({ path: 'postulant' });
  if (user) {
    return res.status(200).json({
      message: 'The user has been successfully found.',
      data: user,
      error: false,
    });
  }
  throw new CustomError(404, `Could not found the user with id ${req.params.id}.`);
};

const create = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.body.postulant);
  let newMongoUser;
  if (postulant?._id) {
    newMongoUser = await userCreation(req, req.body.postulant);
  } else {
    throw new CustomError(
      400,
      `The postulant with the id of ${req.body.postulant} does not exist.`,
    );
  }

  return res.status(201).json({
    message: 'User successfully created.',
    data: newMongoUser,
    error: false,
  });
};

const createManual = async (req: Request, res: Response) => {
  let postulant: mongoose.Types.ObjectId;
  if (!req.body.postulant) {
    const newPostulant = new Postulant<PostulantType>({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      location: req.body.location,
      phone: req.body.phone,
      email: req.body.email,
      dni: req.body.dni,
      birthDate: req.body.birthDate,
      isActive: req.body.isActive,
    });
    await newPostulant.save();
    postulant = newPostulant._id;
  } else {
    const postulantById = await Postulant.findById(req.body.postulant);
    if (!postulantById?._id) {
      throw new CustomError(404, 'The postulant id was not found.');
    }
    if (!(postulantById?.dni === req.body.dni)) {
      throw new CustomError(404, 'The dni of the postulant must not change.');
    }
    postulant = req.body.postulant;
  }
  const newMongoUser = await userCreation(req, postulant);

  return res.status(201).json({
    message: 'User successfully created.',
    data: newMongoUser,
    error: false,
  });
};

const update = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.body.postulant);
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
        message: 'The user has been successfully updated.',
        data: updatedUser,
        error: false,
      });
    }
    throw new CustomError(404, `User with id: ${req.params.id} was not found.`);
  } else {
    throw new CustomError(
      400,
      `The postulant with the id of ${req.body.postulant} does not exist.`,
    );
  }
};

const deleteById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user?.isActive === false) {
    throw new CustomError(400, 'This user has already been disabled.');
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
      message: 'The user has been successfully disabled.',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `User with id: ${req.params.id} was not found.`);
};

const physicalDeleteById = async (req: Request, res: Response) => {
  const result = await User.findByIdAndDelete(req.params.id);
  if (result?.firebaseUid) {
    await firebase.auth().deleteUser(result.firebaseUid);
    return res.status(200).json({
      message: `The user with id ${req.params.id} has been successfully deleted.`,
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `User with id ${req.params.id} was not found.`);
};

const exportToCsv = async (req: Request, res: Response) => {
  const query = filterByIncludes(req.query);
  const docs = await User.aggregate(getUserPipeline(query));
  if (docs.length) {
    const csv = await parseAsync(docs, {
      fields: [
        '_id',
        'isInternal',
        'isActive',
        'email',
        'postulant._id',
        'postulant.firstName',
        'postulant.lastName',
        'postulant.birthDate',
        'postulant.location',
        'postulant.dni',
        'postulant.phone',
      ],
    });
    if (csv) {
      res.set('Content-Type', 'text/csv');
      res.attachment('users.csv');
      return res.status(200).send(csv);
    }
  }
  throw new CustomError(404, 'There are no users to export');
};

export default {
  getAllUsers,
  getUserById,
  create,
  createManual,
  update,
  deleteById,
  physicalDeleteById,
  exportToCsv,
};
