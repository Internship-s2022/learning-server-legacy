import { Request, Response } from 'express';

import Course, { CourseTypes } from '../../models/course';

const getAllCourses = async (req: Request, res: Response) => {
  try {
    if (req.query.id) {
      const course = await Course.find({ _id: req.query.id });
      if (!course) {
        return res.status(404).json({
          message: `Could not found an course by the id of ${req.query.id}.`,
          data: undefined,
          error: true,
        });
      }
      return res.status(200).json({
        message: `Showing the specified course by the id of ${req.query.id}.`,
        data: course,
        error: false,
      });
    }
    if (req.query.isActive) {
      const allCourses = await Course.find({ isActive: req.query.isActive });
      if (allCourses) {
        return res.status(200).json({
          message: 'Showing the list of courses',
          data: allCourses,
          error: false,
        });
      }
      return res.status(404).json({
        message: 'Cannot show the list of courses.',
        data: undefined,
        error: true,
      });
    }
    const allCourses = await Course.find({});
    if (allCourses) {
      return res.status(200).json({
        message: 'Showing all the courses',
        data: allCourses,
        error: false,
      });
    }
    return res.status(404).json({
      message: 'Cannot show the list of courses.',
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

const editCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const result = await Course.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!result) {
        return res.status(404).json({
          message: 'Course not found',
          data: {},
          error: true,
        });
      }
      return res.status(200).json({
        message: 'The course has been updated successfully',
        data: result,
        error: false,
      });
    }
    return res.status(400).json({
      message: 'Invalid format ID',
      data: req.params.id,
      error: true,
    });
  } catch (error: any) {
    return res.json({
      message: 'Error',
      data: error.message,
      error: true,
    });
  }
};

export default { getAllCourses, createCourse, editCourse };
