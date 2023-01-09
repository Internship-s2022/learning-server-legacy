import { Request, Response } from 'express';
import { parseAsync } from 'json2csv';
import { PipelineStage } from 'mongoose';

import { SortType } from 'src/interfaces/request';
import { CustomError } from 'src/models/custom-error';
import Postulant, { PostulantType } from 'src/models/postulant';
import { formatFilters, formatSort, paginateAndFilter } from 'src/utils/query';

import { validateEmail } from '../public/controllers';

const getPostulantPipeline = (query: qs.ParsedQs, sort?: SortType) => {
  const pipeline: PipelineStage[] = [
    {
      $addFields: {
        age: {
          $dateDiff: {
            startDate: {
              $dateFromString: {
                dateString: '$birthDate',
              },
            },
            endDate: '$$NOW',
            unit: 'year',
          },
        },
      },
    },
    { $match: query },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query, sort } = paginateAndFilter(req.query);
  const postulantAggregate = Postulant.aggregate(getPostulantPipeline(query, sort));
  const { docs, ...pagination } = await Postulant.aggregatePaginate(postulantAggregate, {
    page,
    limit,
  });
  if (docs.length) {
    return res.status(200).json({
      message: 'Showing the list of postulants.',
      data: docs,
      pagination,
      error: false,
    });
  }
  throw new CustomError(404, 'Cannot find the list postulants.');
};

const getByDni = async (req: Request, res: Response) => {
  const postulant = await Postulant.findOne({ dni: req.params.dni });
  if (postulant) {
    return res.status(200).json({
      message: 'The postulant has been successfully found.',
      data: postulant,
      error: false,
    });
  }
  throw new CustomError(404, `Postulant with dni ${req.params.dni} was not found.`);
};

const create = async (req: Request, res: Response) => {
  const postulant = await Postulant.findOne({ dni: req.body.dni, isActive: true });
  if (postulant) {
    throw new CustomError(400, `Postulant with dni ${req.body.dni} already exist.`);
  }
  await validateEmail(
    req.body.email,
    `Postulant or user with email ${req.body.email} already exist.`,
  );

  const newPostulant = new Postulant<PostulantType>({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    location: req.body.location,
    phone: req.body.phone,
    email: req.body.email,
    dni: req.body.dni,
    birthDate: req.body.birthDate,
    isActive: req.body.isActive,
  });
  await newPostulant.save();
  return res.status(201).json({
    message: 'Postulant successfully created.',
    data: newPostulant,
    error: false,
  });
};

const update = async (req: Request, res: Response) => {
  const post = await Postulant.findOne({ dni: req.body.dni, isActive: true });
  const currentPost = await Postulant.findOne({ _id: req.params.id, isActive: true });
  if (!currentPost?._id) {
    throw new CustomError(404, `Postulant with id ${req.params.id} was not found.`);
  }

  if (post?.email !== req.body.email) {
    await validateEmail(
      req.body.email,
      `Postulant or user with email ${req.body.email} already exist.`,
    );
  }

  if (post?.dni === currentPost?.dni || !post?._id) {
    const updatedPostulant = await Postulant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      message: 'Postulant successfully updated.',
      data: updatedPostulant,
      error: false,
    });
  }
  throw new CustomError(400, `Postulant with dni ${req.body.dni} already exist.`);
};

const deleteById = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.params.id);
  if (postulant?.isActive === false) {
    throw new CustomError(400, 'This postulant has already been disabled.');
  }
  const result = await Postulant.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    {
      new: true,
    },
  );
  if (result) {
    return res.status(200).json({
      message: 'The postulant has been successfully disabled.',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Postulant with id ${req.params.id} was not found.`);
};

const physicalDeleteById = async (req: Request, res: Response) => {
  const result = await Postulant.findByIdAndDelete(req.params.id);
  if (result) {
    return res.status(200).json({
      message: `The postulant with id ${req.params.id} has been successfully deleted.`,
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Postulant with id ${req.params.id} was not found.`);
};

const exportToCsv = async (req: Request, res: Response) => {
  const { sort, ...rest } = req.query;
  const query = formatFilters(rest);
  const docs = await Postulant.aggregate<PostulantType>(
    getPostulantPipeline(query, formatSort(sort)),
  );
  if (docs.length) {
    const csv = await parseAsync(docs, {
      fields: [
        '_id',
        'firstName',
        'lastName',
        'email',
        'birthDate',
        'age',
        'phone',
        'location',
        'dni',
        'isActive',
      ],
    });
    if (csv) {
      res.set('Content-Type', 'text/csv');
      res.attachment('postulant.csv');
      return res.status(200).send(csv);
    }
  }
  throw new CustomError(404, 'There are no postulants to export.');
};

export default { getAll, getByDni, create, update, deleteById, physicalDeleteById, exportToCsv };
