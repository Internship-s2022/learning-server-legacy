import { Request, Response } from 'express';

import { CustomError } from 'src/models/custom-error';
import User, { UserType } from 'src/models/user';
import { paginateAndFilterByIncludes } from 'src/utils/query';

const getAllUsers = async (req: Request, res: Response) => {
  const { page, limit, query } = paginateAndFilterByIncludes(req.query);
  const users = await User.paginate(query, { page, limit });
  if (users.docs.length) {
    return res.status(200).json({
      message: 'Showing the list of users',
      data: users,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of users.');
};

const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
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
  const newUser = new User<UserType>({
    firebaseUid: req.body.firebaseUid,
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
};

const update = async (req: Request, res: Response) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (updatedUser) {
    return res.status(200).json({
      message: 'The user has been successfully updated',
      data: updatedUser,
      error: false,
    });
  }
  throw new CustomError(404, `User with id: ${req.params.id} was not found`);
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
  if (result) {
    return res.status(200).json({
      message: 'The user has been successfully deleted',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `User with id: ${req.params.id} was not found`);
};

export default {
  getAllUsers,
  getUserById,
  create,
  update,
  deleteById,
};
