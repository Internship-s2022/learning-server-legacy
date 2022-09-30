import { Request, Response } from 'express';

import Course, { CourseTypes } from '../../models/course';

const getAllCourses = async (req: Request, res: Response) => {
  try {
    if (req.query) {
      const allCourses = await Course.find(req.query);
      if (allCourses.length) {
        return res.status(200).json({
          message: 'Showing the list of courses',
          data: allCourses,
          error: false,
        });
      }
      return res.status(404).json({
        message: 'Cannot find the list of courses.',
        data: undefined,
        error: true,
      });
    }
    const allCourses = await Course.find({});
    if (allCourses.length) {
      return res.status(200).json({
        message: 'Showing all the courses',
        data: allCourses,
        error: false,
      });
    }
    return res.status(404).json({
      message: 'Cannot find the list of all courses.',
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

const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        message: `Course with id ${req.params.id} was not found.`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'The course has been successfully found',
      data: course,
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
      message: 'Course successfully created.',
      data: course,
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

const updateCourse = async (req: Request, res: Response) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCourse) {
      return res.status(404).json({
        message: `Course with id ${req.params.id} was not found.`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'The course has been successfully updated.',
      data: updatedCourse,
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

const deleteCourse = async (req: Request, res: Response) => {
  try {
    const result = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      {
        new: true,
      },
    );
    if (!result) {
      return res.status(404).json({
        message: `Course with id ${req.params.id} was not found.`,
        data: undefined,
        error: true,
      });
    }
    return res.status(200).json({
      message: 'The course has been successfully deleted',
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

export default { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
