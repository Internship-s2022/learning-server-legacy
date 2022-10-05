import { Request, Response } from 'express';

import RegistrationForm, { RegistrationFormTypes } from '../../models/registration-form';

const getAll = async (req: Request, res: Response) => {
  try {
    if (req.query) {
      const allRegistrationForms = await RegistrationForm.find(req.query);
      if (allRegistrationForms.length) {
        return res.status(200).json({
          message: 'Showing the list of registration forms',
          data: allRegistrationForms,
          error: false,
        });
      }
      return res.status(404).json({
        message: 'Cannot find the list of registration forms.',
        data: undefined,
        error: true,
      });
    }
    const allRegistrationForms = await RegistrationForm.find({});
    if (allRegistrationForms.length) {
      return res.status(200).json({
        message: 'Showing all the registration forms',
        data: allRegistrationForms,
        error: false,
      });
    }
    return res.status(404).json({
      message: 'Cannot find the list of all registration forms.',
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

const getById = async (req: Request, res: Response) => {
  try {
    const registrationForm = await RegistrationForm.findById(req.params.id);
    if (!registrationForm) {
      return res.status(404).json({
        message: `Registration form with id ${req.params.id} was not found.`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'The registration form has been successfully found',
      data: registrationForm,
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

const create = async (req: Request, res: Response) => {
  try {
    const registrationForm = new RegistrationForm<RegistrationFormTypes>({
      course_id: req.body.course_id,
      title: req.body.title,
      description: req.body.description,
      views: req.body.views,
      isActive: req.body.isActive,
    });
    await registrationForm.save();
    return res.status(201).json({
      message: 'Registration form successfully created.',
      data: registrationForm,
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

const updateById = async (req: Request, res: Response) => {
  try {
    const updatedRegistrationForm = await RegistrationForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    if (!updatedRegistrationForm) {
      return res.status(404).json({
        message: `Registration form with id ${req.params.id} was not found.`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'The registration form has been successfully updated.',
      data: updatedRegistrationForm,
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

const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await RegistrationForm.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      {
        new: true,
      },
    );
    if (!result) {
      return res.status(404).json({
        message: `Registration form with id ${req.params.id} was not found.`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'The registration form has been successfully deleted',
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

export default { getAll, getById, create, updateById, deleteById };
