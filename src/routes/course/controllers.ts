import { Request, Response } from 'express';

import Course, { CourseTypes } from '../../models/course';

const createCourse = async (req: Request, res: Response) => {
  try {
    const course = new Course<CourseTypes>({
      name: req.body.name,
      description: req.body.description,
      inscriptionStartDate: req.body.inscriptionStartDate,
      inscriptionEndDate: req.body.inscriptionEndDate,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      type: req.body.type,
      isInternal: req.body.isInternal,
      isActive: req.body.isActive,
    });
    await course.save();
    return res.status(201).json({
      message: 'Course created successfully.',
      data: course,
      error: false,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: `Something went wrong: ${error.message}`,
      data: {},
      error: true,
    });
  }
};

export default { createCourse };
