import { Request, Response } from 'express';

import AdmissionTest, { AdmissionTestTypes } from 'src/models/admission-test';
import { CustomError } from 'src/models/custom-error';

const getAll = async (req: Request, res: Response) => {
  const admissionTest = await AdmissionTest.find(req.query);
  if (admissionTest.length) {
    return res.status(200).json({
      message: 'Showing the list of admission tests',
      data: admissionTest,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of admission test.');
};

const getById = async (req: Request, res: Response) => {
  const admissionTest = await AdmissionTest.findById(req.params.id);
  if (admissionTest) {
    return res.status(200).json({
      message: 'The admission test has been successfully found',
      data: admissionTest,
      error: false,
    });
  }
  throw new CustomError(404, `Admission test with id ${req.params.id} was not found.`);
};

const create = async (req: Request, res: Response) => {
  const admissionTest = new AdmissionTest<AdmissionTestTypes>({
    name: req.body.name,
    isActive: req.body.isActive,
  });
  await admissionTest.save();
  return res.status(201).json({
    message: 'Admission test successfully created.',
    data: admissionTest,
    error: false,
  });
};

const update = async (req: Request, res: Response) => {
  const updatedAdmissionTest = await AdmissionTest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (updatedAdmissionTest) {
    return res.status(200).json({
      message: 'The admission test has been successfully updated.',
      data: updatedAdmissionTest,
      error: false,
    });
  }
  throw new CustomError(404, `Admission test with id ${req.params.id} was not found.`);
};

const deleteById = async (req: Request, res: Response) => {
  const admissionTest = await AdmissionTest.findById(req.params.id);
  if (admissionTest?.isActive === false) {
    throw new CustomError(404, 'Admission test has already been deleted');
  }
  const result = await AdmissionTest.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    {
      new: true,
    },
  );
  if (result) {
    return res.status(200).json({
      message: 'The admission test has been successfully deleted',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Admission test with id ${req.params.id} was not found.`);
};

export default { getAll, getById, create, update, deleteById };
