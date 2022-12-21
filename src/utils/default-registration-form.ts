import mongoose from 'mongoose';

import { CustomError } from 'src/models/custom-error';
import Question, { QuestionType } from 'src/models/question';
import RegistrationForm, { RegistrationFormType } from 'src/models/registration-form';

export const createDefaultRegistrationForm = async (
  courseId: mongoose.Types.ObjectId | undefined,
) => {
  if (!courseId) {
    throw new CustomError(
      500,
      'There was an error during the creation of the default registration form, missing courseId.',
    );
  }
  let newRegistrationForm;
  try {
    const defaultRegistrationForm = new RegistrationForm<RegistrationFormType>({
      course: courseId,
      title: 'General',
      description: 'Main registration form',
      views: [
        { name: 'General' },
        { name: 'Redes' },
        { name: 'Facultad' },
        { name: 'Conocidos' },
        { name: 'Homepage' },
      ],
      isActive: true,
    });
    newRegistrationForm = await defaultRegistrationForm.save();
  } catch {
    throw new CustomError(
      500,
      'There was an error during the creation of the default registration form.',
    );
  }
  try {
    const generalViewId = newRegistrationForm.views.find((view) => view.name === 'General')
      ?._id as mongoose.Types.ObjectId;
    const defaultQuestions: QuestionType[] = [
      {
        registrationForm: newRegistrationForm._id,
        title: 'Nombre/s:',
        type: 'SHORT_ANSWER',
        view: generalViewId,
        key: 'firstName',
        isRequired: true,
      },
      {
        registrationForm: newRegistrationForm._id,
        title: 'Apellido:',
        type: 'SHORT_ANSWER',
        view: generalViewId,
        key: 'lastName',
        isRequired: true,
      },
      {
        registrationForm: newRegistrationForm._id,
        title: 'Email:',
        type: 'SHORT_ANSWER',
        view: generalViewId,
        key: 'email',
        isRequired: true,
      },
      {
        registrationForm: newRegistrationForm._id,
        title: 'Fecha de nacimiento:',
        type: 'SHORT_ANSWER',
        view: generalViewId,
        key: 'birthDate',
        isRequired: true,
      },
      {
        registrationForm: newRegistrationForm._id,
        title: 'DNI:',
        type: 'SHORT_ANSWER',
        view: generalViewId,
        key: 'dni',
        isRequired: true,
      },
      {
        registrationForm: newRegistrationForm._id,
        title: 'Pais:',
        type: 'DROPDOWN',
        options: [
          {
            value: 'Argentina',
          },
          {
            value: 'Uruguay',
          },
        ],
        view: generalViewId,
        key: 'location',
        isRequired: true,
      },
      {
        registrationForm: newRegistrationForm._id,
        title: 'Localidad:',
        type: 'SHORT_ANSWER',
        view: generalViewId,
        isRequired: true,
      },
      {
        registrationForm: newRegistrationForm._id,
        title: 'Telefono:',
        type: 'SHORT_ANSWER',
        view: generalViewId,
        key: 'phone',
        isRequired: true,
      },
    ];
    await Question.insertMany(defaultQuestions);
  } catch {
    throw new CustomError(500, 'There was an error during the creation of the default questions.');
  }
  return newRegistrationForm;
};
