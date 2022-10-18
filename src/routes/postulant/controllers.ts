import { Request, Response } from 'express';
import { Parser } from 'json2csv';

import { CustomError } from 'src/models/custom-error';
import Postulant, { PostulantType } from 'src/models/postulant';
import { paginateAndFilterByIncludes } from 'src/utils/query';

const getAll = async (req: Request, res: Response) => {
  const { page, limit, query } = paginateAndFilterByIncludes(req.query);
  const { docs, ...pagination } = await Postulant.paginate(query, { page, limit });
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
      message: 'The postulant has been successfully found',
      data: postulant,
      error: false,
    });
  }
  throw new CustomError(404, `Postulant with dni ${req.params.id} was not found.`);
};

const create = async (req: Request, res: Response) => {
  try {
    const postulant = new Postulant<PostulantType>({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      location: req.body.location,
      phone: req.body.phone,
      email: req.body.email,
      dni: req.body.dni,
      birthDate: req.body.birthDate,
      isActive: req.body.isActive,
    });
    await postulant.save();
    return res.status(201).json({
      message: 'Postulant successfully created.',
      data: postulant,
      error: false,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      throw new CustomError(400, 'Postulant dni is already in use');
    } else throw new CustomError(500, 'Something went wrong');
  }
};

const update = async (req: Request, res: Response) => {
  const updatedPostulant = await Postulant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (updatedPostulant) {
    return res.status(200).json({
      message: 'The postulant has been successfully updated.',
      data: updatedPostulant,
      error: false,
    });
  }
  throw new CustomError(404, `Postulant with id ${req.params.id} was not found.`);
};

const deleteById = async (req: Request, res: Response) => {
  const postulant = await Postulant.findById(req.params.id);
  if (!postulant?.isActive) {
    throw new CustomError(404, 'Postulant has already been deleted');
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
      message: 'The postulant has been successfully deleted',
      data: result,
      error: false,
    });
  }
  throw new CustomError(404, `Postulant with id ${req.params.id} was not found.`);
};

const exportCSV = async (req: Request, res: Response) => {
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(req.body);
  res.attachment('postulants.csv');
  return res.status(200).send(csv);
};

export default { getAll, getByDni, create, update, deleteById, exportCSV };
