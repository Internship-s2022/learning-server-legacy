import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { CustomError } from 'src/models/custom-error';
import Group from 'src/models/group';
import Report from 'src/models/report';
import { formatSort } from 'src/utils/query';

import { getHistoryPipeline, getReportPipeline } from './aggregations';

const getReports = async (req: Request, res: Response) => {
  const studentId = req.courseUserId;
  const { sort } = req.query;
  const response = await Report.aggregate(
    getReportPipeline({ courseUser: new mongoose.Types.ObjectId(studentId) }, formatSort(sort)),
  ).collation({ locale: 'en_US', numericOrdering: true });
  if (response.length) {
    return res.status(200).json({
      message: 'Showing your list of reports.',
      data: response,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find your list of reports.');
};

const getHistory = async (req: Request, res: Response) => {
  const studentId = req.courseUserId;
  const { sort } = req.query;
  const response = await Group.aggregate(
    getHistoryPipeline(
      { 'courseUsers._id': { $in: [new mongoose.Types.ObjectId(studentId)] } },
      formatSort(sort),
    ),
  ).collation({ locale: 'en_US', numericOrdering: true });
  if (response.length) {
    return res.status(200).json({
      message: 'Showing your history throughout the course.',
      data: response,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find your history throughout the course.');
};

export default { getReports, getHistory };
