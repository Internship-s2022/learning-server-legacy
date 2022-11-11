import { Request, Response } from 'express';
import { Types } from 'mongoose';

import AdmissionResult from 'src/models/admission-result';
import Course from 'src/models/course';
import { CustomError } from 'src/models/custom-error';
import Postulant from 'src/models/postulant';
import PostulantCourse, { PostulantCourseType } from 'src/models/postulant-course';

const create = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.body.postulant);
  const course = await Course.findById(req.params.courseId);
  if (postulant && course) {
    const postulantCourse = await PostulantCourse.find({
      postulant: req.body.postulant,
      course: req.params.courseId,
    });
    if (postulantCourse.length) {
      throw new CustomError(
        400,
        `The postulant with id: ${req.body.postulant} has been already postulated in this course.`,
      );
    }
    const setAdmissionResults = await AdmissionResult.insertMany(
      course.admissionTests.map((item) => ({
        admissionTest: item,
      })),
    );
    const newPostulantCourse = new PostulantCourse<PostulantCourseType>({
      course: new Types.ObjectId(req.params.courseId),
      postulant: req.body.postulant,
      admissionResults: setAdmissionResults.map((item) => item._id),
      answer: req.body.answer,
      view: req.body.view,
      isActive: req.body.isActive,
    });
    await newPostulantCourse.save();
    return res.status(201).json({
      message: 'Postulant successfully registered.',
      data: newPostulantCourse,
      error: false,
    });
  } else {
    throw new CustomError(404, 'The postulant or course does not exist');
  }
};

export default {
  create,
};
