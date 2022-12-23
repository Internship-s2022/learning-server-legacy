import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';
import mongoose from 'mongoose';

import CourseUser from 'src/models/course-user';
import { CustomError } from 'src/models/custom-error';
import Group from 'src/models/group';
import Module from 'src/models/module';
import Report, { ReportDocument, ReportIdType, ReportType } from 'src/models/report';
import { filterIncludeArrayOfIds, paginateAndFilter } from 'src/utils/query';

import { getReportPipeline } from './aggregations';

const exportReports = async (docs: ReportDocument[], res: Response) => {
  const reportsWithExams = docs.reduce((prev: Record<string, unknown>[], report, index) => {
    const exams = report.exams.reduce((prev: Record<string, number>, exam) => {
      return { ...prev, [exam.name]: exam.grade };
    }, {});
    const { _id, module, courseUser, assistance } = report;
    prev[index] = { _id, module, courseUser, assistance, ...exams };
    return prev;
  }, []);
  const examsHeads = docs.reduce((prev: string[], report: ReportType) => {
    report.exams.map((exam) => {
      if (!prev.includes(exam.name)) {
        prev.push(exam.name);
      }
    });
    return prev;
  }, []);
  if (docs.length) {
    const csv = await parseAsync(reportsWithExams, {
      fields: [
        { value: '_id', label: 'report._id' },
        { value: 'courseUser.user.postulant.firstName', label: 'firstName' },
        { value: 'courseUser.user.postulant.lastName', label: 'lastName' },
        { value: 'courseUser.user.postulant.dni', label: 'DNI' },
        { value: 'assistance', label: 'report.assistance' },
        ...examsHeads,
        { value: 'courseUser.user.email', label: 'email' },
        { value: 'courseUser.role', label: 'role' },
        'module.name',
        'module.status',
        'module.type',
      ],
    });
    if (csv) {
      res.set('Content-Type', 'text/csv');
      res.attachment('reports.csv');
      return res.status(200).send(csv);
    }
  }
  throw new CustomError(404, 'There are no reports to export');
};

const reportsByCourseId = async (courseId: string, reqQuery: qs.ParsedQs = {}) => {
  const { query, sort } = paginateAndFilter(reqQuery);
  const modulesInCourse = await Module.find({
    course: new mongoose.Types.ObjectId(courseId),
  });
  if (!modulesInCourse.length) {
    throw new CustomError(
      404,
      `Cannot find the list of reports in the course ${courseId}. There are not any modules on this course.`,
    );
  }
  const reportAggregate = await Report.aggregate<ReportDocument>(
    getReportPipeline(
      {
        ...query,
        $or: modulesInCourse.map((module) => ({
          'module._id': module._id,
        })),
      },
      sort,
    ),
  );
  // TO-DO: Paginate by student
  // const response = await Report.aggregatePaginate(reportAggregate, {
  //   page,
  //   limit,
  // });
  return reportAggregate;
};

const getByCourseId = async (req: Request, res: Response) => {
  const docs = await reportsByCourseId(req.params.courseId, req.query);
  if (docs.length) {
    return res.status(200).json({
      message: `Showing the list of reports in the course ${req.params.courseId}.`,
      data: docs,
      pagination: {
        totalDocs: docs.length,
        limit: docs.length,
        totalPages: 1,
        page: 1,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      },
      error: false,
    });
  }
  throw new CustomError(
    404,
    `Cannot find the list of reports in the group ${req.params.courseId}.`,
  );
};

const exportByCourseId = async (req: Request, res: Response) => {
  const docs = await reportsByCourseId(req.params.courseId, req.query);
  await exportReports(docs, res);
};

const reportsByModuleId = async (moduleId: string, reqQuery: qs.ParsedQs = {}) => {
  const module = await Module.findById(moduleId);
  if (!module) {
    throw new CustomError(404, `Module with id ${moduleId} was not found.`);
  }
  const { page, limit, query, sort } = paginateAndFilter(reqQuery);
  const reportAggregate = Report.aggregate(
    getReportPipeline({ ...query, 'module._id': new mongoose.Types.ObjectId(moduleId) }, sort),
  );
  const response = await Report.aggregatePaginate(reportAggregate, { page, limit });
  return response;
};

const getByModuleId = async (req: Request, res: Response) => {
  const { docs, ...pagination } = await reportsByModuleId(req.params.moduleId, req.query);
  if (docs.length) {
    return res.status(200).json({
      message: `Showing the list of reports in the module ${req.params.moduleId}.`,
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(
    404,
    `Cannot find the list of reports in the module ${req.params.moduleId}.`,
  );
};

const exportByModuleId = async (req: Request, res: Response) => {
  const { docs } = await reportsByModuleId(req.params.moduleId, req.query);
  await exportReports(docs, res);
};

const reportsByGroupId = async (groupId: string, reqQuery: qs.ParsedQs = {}) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new CustomError(404, `Group with id ${groupId} was not found.`);
  }
  const { page, limit, query, sort } = paginateAndFilter(reqQuery);
  const modulesIncludeGroup = await Module.find({
    groups: { $in: groupId },
  });
  if (!modulesIncludeGroup.length) {
    throw new CustomError(
      404,
      `Cannot find the list of reports in the grouo ${groupId}. This group in not assigned to any module.`,
    );
  }
  const reportAggregate = Report.aggregate(
    getReportPipeline(
      {
        ...query,
        $or: modulesIncludeGroup.map((module) => ({
          'module._id': module._id,
        })),
      },
      sort,
    ),
  );
  const response = await Report.aggregatePaginate(reportAggregate, {
    page,
    limit,
  });
  return response;
};

const getByGroupId = async (req: Request, res: Response) => {
  const { docs, ...pagination } = await reportsByGroupId(req.params.groupId, req.query);
  if (docs.length) {
    return res.status(200).json({
      message: `Showing the list of reports in the group ${req.params.groupId}.`,
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(404, `Cannot find the list of reports in the group ${req.params.groupId}.`);
};

const exportByGroupId = async (req: Request, res: Response) => {
  const { docs } = await reportsByGroupId(req.params.groupId, req.query);
  await exportReports(docs, res);
};

const reportsByStudentId = async (studentId: string, reqQuery: qs.ParsedQs = {}) => {
  const student = await CourseUser.findById(studentId);
  if (!(student?.role === 'STUDENT')) {
    if (!student) {
      throw new CustomError(404, `Course User with id ${studentId} was not found.`);
    }
    throw new CustomError(404, `Course User with id ${studentId} is not a student.`);
  }
  const { page, limit, query, sort } = paginateAndFilter(reqQuery);
  const reportAggregate = Report.aggregate(
    getReportPipeline(
      {
        ...query,
        'courseUser._id': new mongoose.Types.ObjectId(studentId),
      },
      sort,
    ),
  );
  const response = await Report.aggregatePaginate(reportAggregate, {
    page,
    limit,
  });
  return response;
};

const getByStudentId = async (req: Request, res: Response) => {
  const { docs, ...pagination } = await reportsByStudentId(req.params.studentId, req.query);
  if (docs.length) {
    return res.status(200).json({
      message: `Showing the list of reports of the student ${req.params.studentId}.`,
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(
    404,
    `Cannot find the list of reports of the student ${req.params.studentId}.`,
  );
};

const exportByStudentId = async (req: Request, res: Response) => {
  const { docs } = await reportsByStudentId(req.params.studentId, req.query);
  await exportReports(docs, res);
};

export const createReports = async (courseUsers: string[], modules: string[]) => {
  try {
    const groupCourseUsers = await CourseUser.find(filterIncludeArrayOfIds(courseUsers));
    const students = groupCourseUsers.filter((cUser) => cUser.role === 'STUDENT');
    const reports = modules.reduce<ReportType[]>((prev: ReportType[], moduleId: string) => {
      students.forEach((student) => {
        prev.push({
          module: new mongoose.Types.ObjectId(moduleId),
          courseUser: student._id,
          exams: [{ name: 'Problemática', grade: 0 }],
          assistance: false,
        });
      });
      return prev;
    }, []);
    await Report.insertMany(reports);
    return true;
  } catch {
    return false;
  }
};

export const deleteReportsByGroupId = async (groupId: string) => {
  try {
    const { docs } = await reportsByGroupId(groupId);
    await Report.deleteMany(
      filterIncludeArrayOfIds(docs.map((report) => report._id?.toString() as string)),
    );
    return true;
  } catch {
    return false;
  }
};

const update = async (req: Request, res: Response) => {
  const reportsBody: ReportIdType[] = req.body;
  const reports = await Report.find(
    filterIncludeArrayOfIds(reportsBody.map((report) => report._id.toString())),
  );
  if (reports.length !== reportsBody.length) {
    throw new CustomError(404, 'One or more of the reports do not exist.');
  }
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].exams.length !== reportsBody[i].exams.length) {
      throw new CustomError(
        404,
        'One or more of the report exams is not in the report or is missing in body.',
      );
    }
    for (let j = 0; j < reports[i].exams.length; j++) {
      const index = reports[i].exams.findIndex(
        (exam) => exam._id?.toString() === reportsBody[i].exams[j]._id,
      );
      if (index === -1) {
        throw new CustomError(
          404,
          'One or more of the report exams id is not in the report or is missing in body.',
        );
      }
      reports[i].exams[index].grade = reportsBody[i].exams[j].grade;
    }
  }
  const updatedReports: ReportType[] = [];
  try {
    await Promise.all(
      reports.map(async (report) => {
        const updatedReport = await Report.findByIdAndUpdate(report._id, report, {
          new: true,
        });
        if (updatedReport) {
          updatedReports.push(updatedReport as ReportType);
        }
      }),
    );
    return res.status(200).json({
      message: 'The list of reports has been succesfully updated.',
      data: updatedReports,
      error: false,
    });
  } catch {
    throw new CustomError(404, 'There was an error during the update of the reports.');
  }
};

export default {
  getByCourseId,
  exportByCourseId,
  getByModuleId,
  exportByModuleId,
  getByGroupId,
  exportByGroupId,
  getByStudentId,
  exportByStudentId,
  update,
};
