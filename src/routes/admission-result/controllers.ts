import { Request, Response } from 'express';

import AdmissionResult from 'src/models/admission-result';
import { CustomError } from 'src/models/custom-error';
import { paginateAndFilter } from 'src/utils/query';

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query, sort } = paginateAndFilter(req.query);
  const { docs, ...pagination } = await AdmissionResult.paginate(query, { page, limit, sort });
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of admission results.',
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list admission results.');
};

export default { getAll };
