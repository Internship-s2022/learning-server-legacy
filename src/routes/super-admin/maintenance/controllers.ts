import { Request, Response } from 'express';

import { CustomError } from 'src/models/custom-error';

import seed from '../../../../seeders/seed';

const seedDatabase = async (req: Request, res: Response) => {
  try {
    await seed(false);
    return res.status(200).json({
      message: 'The database has been seeded successfully.',
      error: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new CustomError(500, 'Something went wrong while seeding the database.', { ...error });
  }
};

export default { seedDatabase };
