import { Request, Response } from 'express';

import { CustomError } from 'src/models/custom-error';
import Question, { QuestionType } from 'src/models/question';
import RegistrationForm from 'src/models/registration-form';
import { filterByIncludes } from 'src/utils/query';

const getAll = async (req: Request, res: Response) => {
  const query = filterByIncludes({
    ...req.query,
    registrationForm: req.params.regFormId,
  });
  const docs = await Question.find(query);
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of questions',
      data: docs,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of questions.');
};

const getById = async (req: Request, res: Response) => {
  const registrationForm = RegistrationForm.findById(req.params.regFormId);
  if (!registrationForm) {
    throw new CustomError(404, `Registration form with id ${req.params.regFormId} was not found.`);
  }
  const question = await Question.findById(req.params.questionId);
  if (question) {
    return res.status(200).json({
      message: 'The question has been successfully found',
      data: question,
      error: false,
    });
  }
  throw new CustomError(404, `Question with id ${req.params.questionId} was not found.`);
};

const create = async (req: Request, res: Response) => {
  const regFormId = req.params.regFormId;
  const registrationForm = RegistrationForm.findById(regFormId);
  if (!registrationForm) {
    throw new CustomError(404, `Registration form with id ${regFormId} was not found.`);
  }
  const response = await Question.insertMany(
    req.body.map((question: QuestionType[]) => ({
      ...question,
      registrationForm: regFormId,
    })),
  );
  return res.status(201).json({
    message: 'Questions successfully created.',
    data: response,
    error: false,
  });
};

const updateById = async (req: Request, res: Response) => {
  const updatedQuestion = await Question.findByIdAndUpdate(req.params.questionId, req.body, {
    new: true,
  });
  if (updatedQuestion) {
    return res.status(200).json({
      message: 'The question has been successfully updated.',
      data: updatedQuestion,
      error: false,
    });
  }
  throw new CustomError(404, `Question with id ${req.params.questionId} was not found.`);
};

const physicalDeleteById = async (req: Request, res: Response) => {
  const result = await Question.findByIdAndDelete(req.params.questionId);
  if (result) {
    return res.status(200).json({
      message: `The question with id ${req.params.questionId} has been successfully deleted`,
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Question with id ${req.params.questionId} was not found.`);
};

export default { getAll, getById, create, updateById, physicalDeleteById };
