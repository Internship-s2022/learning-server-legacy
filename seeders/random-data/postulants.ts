import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import { PostulantType } from '../../src/models/postulant';
import { padMessage } from '../utils';

const randomPostulant = (): PostulantType => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.firstName();

  return {
    _id: new mongoose.Types.ObjectId(),
    birthDate: faker.date.birthdate({ mode: 'age', min: 18, max: 60 }).toISOString(),
    country: faker.helpers.arrayElement(['Argentina', 'Uruguay']),
    dni: faker.helpers.regexpStyleStringParse('[1-5][1-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
    email: faker.internet.email(firstName, lastName, 'getnada.com'),
    phone: faker.phone.number('15########'),
    isActive: true,
    firstName,
    lastName,
  };
};

export const generateRandomPostulants = (amount: number) => {
  console.log('\n\x1b[36m', padMessage('⚡️ Generating Random Postulants'));

  const postulants: PostulantType[] = [];
  const postulantsIds: PostulantType['_id'][] = [];

  for (let i = 0; i < amount; i++) {
    const postulant = randomPostulant();
    postulants.push(postulant);
    postulantsIds.push(postulant._id);
  }

  return { postulants, postulantsIds };
};
