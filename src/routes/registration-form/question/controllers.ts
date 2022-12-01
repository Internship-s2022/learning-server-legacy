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
      message: 'Showing the list of questions.',
      data: docs,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list of questions.');
};

const getById = async (req: Request, res: Response) => {
  const question = await Question.findById(req.params.questionId);
  if (question) {
    return res.status(200).json({
      message: 'The question has been successfully found.',
      data: question,
      error: false,
    });
  }
  throw new CustomError(404, `Question with id ${req.params.questionId} was not found.`);
};

const create = async (req: Request, res: Response) => {
  const registrationForm = await RegistrationForm.findById(req.params.regFormId);
  if (!registrationForm?.isActive) {
    if (!registrationForm) {
      throw new CustomError(
        404,
        `Registration form with the id ${req.params.regFormId} was not found.`,
      );
    }
    throw new CustomError(
      404,
      `Registration form with the id ${req.params.regFormId} is not active.`,
    );
  }
  for (let i = 0; i < req.body.length; i++) {
    const question = req.body[i];
    if (!registrationForm.views.some((view) => view._id?.toString() === question.view)) {
      throw new CustomError(404, `Question[${i}] view is not found on the registration form.`);
    }
  }

  const response = await Question.insertMany(
    req.body.map((question: QuestionType[]) => ({
      ...question,
      registrationForm: req.params.regFormId,
    })),
  );
  return res.status(201).json({
    message: 'Questions successfully created.',
    data: response,
    error: false,
  });
};

const updateById = async (req: Request, res: Response) => {
  const registrationForm = await RegistrationForm.findById(req.params.regFormId);
  if (!registrationForm?.isActive) {
    if (!registrationForm) {
      throw new CustomError(
        404,
        `Registration form with the id ${req.params.regFormId} was not found.`,
      );
    }
    throw new CustomError(
      404,
      `Registration form with the id ${req.params.regFormId} is not active.`,
    );
  }
  if (!registrationForm.views.some((view) => view._id?.toString() === req.body.view)) {
    throw new CustomError(404, 'Question view is not found on the registration form.');
  }
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
      message: `The question with id ${req.params.questionId} has been successfully deleted.`,
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Question with id ${req.params.questionId} was not found.`);
};

export default { getAll, getById, create, updateById, physicalDeleteById };
