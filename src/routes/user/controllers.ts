import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';
import mongoose from 'mongoose';

import firebase from 'src/config/firebase';
import sendgridTemplates from 'src/constants/sendgrid-templates';
import { CustomError } from 'src/models/custom-error';
import Postulant, { PostulantType } from 'src/models/postulant';
import User, { UserType } from 'src/models/user';
import generatePassword from 'src/utils/password-generator';
import { filterByIncludes, paginateAndFilterByIncludes } from 'src/utils/query';
import sendEmail from 'src/utils/send-email';

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
  const newPassword = generatePassword(24);
  const postulant = await Postulant.findById(req.body.postulantId);
  let newMongoUser;
  if (postulant?._id) {
    const newFirebaseUser = await firebase.auth().createUser({
      email: req.body.email,
      password: newPassword,
    });
    const firebaseUid = newFirebaseUser.uid;
    await firebase.auth().setCustomUserClaims(newFirebaseUser.uid, { userType: 'NORMAL' });
    try {
      newMongoUser = new User<UserType>({
        firebaseUid,
        postulantId: postulant._id,
        isInternal: req.body.isInternal,
        isActive: req.body.isActive,
      });
      await newMongoUser.save();
    } catch (err: any) {
      await firebase.auth().deleteUser(firebaseUid);
      throw new Error(err.message);
    }

    await sendEmail(
      req.body.email,
      sendgridTemplates.sendUserCredentials,
      {
        email: req.body.email,
        password: newPassword,
      },
      async (err: any, result) => {
        if (err) {
          await firebase.auth().deleteUser(firebaseUid);
          throw new Error(`Sendgrid error: ${err.message}`);
        }
      },
    );
  } else {
    throw new CustomError(
      400,
      `The postulant with the id of ${req.body.postulantId} does not exist`,
    );
  }

  return res.status(201).json({
    message: 'User successfully created',
    data: newMongoUser,
    error: false,
  });
};

const createManual = async (req: Request, res: Response) => {
  let postulantId: mongoose.Types.ObjectId;
  if (!req.body.postulantId) {
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
    postulantId = newPostulant._id;
  } else {
    postulantId = req.body.postulantId;
    const postulantById = await Postulant.findById(req.body.postulantId);
    if (!postulantById?._id) {
      throw new CustomError(404, 'The postulant id was not found');
    }
  }
  const newPassword = generatePassword(24);
  const newFirebaseUser = await firebase.auth().createUser({
    email: req.body.email,
    password: newPassword,
  });
  const firebaseUid = newFirebaseUser.uid;
  await firebase.auth().setCustomUserClaims(newFirebaseUser.uid, { userType: 'NORMAL' });

  let newMongoUser;
  try {
    newMongoUser = new User<UserType>({
      firebaseUid,
      postulantId: postulantId,
      isInternal: req.body.isInternal,
      isActive: req.body.isActive,
    });
    await newMongoUser.save();
  } catch (err: any) {
    await firebase.auth().deleteUser(firebaseUid);
    throw new Error(err.message);
  }

  await sendEmail(
    req.body.email,
    sendgridTemplates.sendUserCredentials,
    {
      email: req.body.email,
      password: newPassword,
    },
    async (err: any, result) => {
      if (err) {
        await firebase.auth().deleteUser(firebaseUid);
        throw new Error(`Sendgrid error: ${err.message}`);
      }
    },
  );

  return res.status(201).json({
    message: 'User successfully created',
    data: newMongoUser,
    error: false,
  });
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
  createManual,
  update,
  deleteById,
  exportToCsv,
};
