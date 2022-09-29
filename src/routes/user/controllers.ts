import { Request, Response } from 'express';
import fs from 'fs';

import users from '../../data/users';
import { User } from './types';

const getAllUsers = (req: Request, res: Response) => {
  try {
    const allUsers = users.filter(
      (user) => (user.firstName && user.firstName === req.body.firstName) || user.isActive,
    );
    if (allUsers.length > 0) {
      return res.status(200).json({
        message: 'Showing Users.',
        data: allUsers,
        error: false,
      });
    }
    return res.status(404).json({
      message: 'Cannot show the list of Users.',
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

const getUserById = (req: Request, res: Response) => {
  try {
    if (req.params.id) {
      const user = users.find((user) => user.id === req.params.id && user.isActive);
      if (!user) {
        return res.status(404).json({
          message: `Could not found an user by the id of ${req.params.id}.`,
          data: undefined,
          error: true,
        });
      }
      return res.status(200).json({
        message: `Showing the specified user by the id of ${req.params.id}.`,
        data: user,
        error: false,
      });
    }
    return res.status(400).json({
      message: 'No input available.',
      data: undefined,
      error: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: `Could not found an user by the id of ${req.params.id}.`,
      data: undefined,
      error: true,
    });
  }
};

const createUser = (req: Request, res: Response) => {
  try {
    const newUser = req.body;
    if (newUser.id && newUser.firstName && newUser.lastName && newUser.email && newUser.password) {
      users.push(newUser);
      fs.writeFile('src/data/users.json', JSON.stringify(users), (err) => {
        if (err) {
          return res.status(500).json({
            message: `Something went wrong: ${err.message}`,
            data: undefined,
            error: true,
          });
        } else {
          return res.status(200).json({
            message: 'User added successfully.',
            data: newUser,
            error: false,
          });
        }
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: `MongoDB Error: ${error.message}`,
      data: undefined,
      error: true,
    });
  }
};

const editUser = (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        message: 'Missing id parameter',
        data: undefined,
        error: true,
      });
    }
    const user = users.find((user) => user.id === req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        data: undefined,
        error: true,
      });
    }
    const newUsers = users.filter((user) => user.id !== req.params.id);
    const editedUser = {
      ...user,
      ...req.body,
    };
    newUsers.push(editedUser);
    fs.writeFile('src/data/users.json', JSON.stringify(newUsers), (err) => {
      if (err) {
        return res.status(500).json({
          message: `Something went wrong: ${err.message}`,
          data: undefined,
          error: true,
        });
      } else {
        return res.status(200).json({
          message: 'User updated',
          data: editedUser,
          error: false,
        });
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      data: undefined,
      error: true,
    });
  }
};

const deleteUser = (req: Request, res: Response) => {
  try {
    const user = users.find((user) => user.id === req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        data: undefined,
        error: true,
      });
    }
    const newUsers = users.filter((user) => user.id !== req.params.id);
    const editedUser = {
      ...user,
      isActive: false,
    };
    newUsers.push(editedUser);
    fs.writeFile('src/data/users.json', JSON.stringify(newUsers), (err) => {
      if (err) {
        return res.status(500).json({
          message: `Something went wrong: ${err.message}`,
          data: undefined,
          error: true,
        });
      } else {
        return res.status(200).json({
          message: 'User deleted',
          data: editedUser,
          error: false,
        });
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      data: undefined,
      error: true,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
};
