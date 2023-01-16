import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import { FirebaseUser } from '../../src/interfaces/firebase';
import { PostulantType } from '../../src/models/postulant';
import { UserType } from '../../src/models/user';
import { padMessage } from '../utils';

const randomFirebaseUser = (email: string): FirebaseUser => {
  return {
    uid: faker.datatype.uuid(),
    isNewUser: faker.datatype.boolean(),
    password: 'password123',
    type: 'NORMAL',
    email,
  };
};

const randomUser = ({
  uid,
  isNewUser,
  email,
  postulantId,
}: Omit<FirebaseUser, 'password' | 'type'> & { postulantId: PostulantType['_id'] }): UserType => {
  return {
    _id: new mongoose.Types.ObjectId(),
    isInternal: faker.datatype.boolean(),
    isActive: faker.datatype.boolean(),
    postulant: new mongoose.Types.ObjectId(postulantId),
    isNewUser: isNewUser || true,
    email: email,
    firebaseUid: uid,
    initialPassword: 'password123',
  };
};

export const generateRandomUsers = (amount: number, postulants: PostulantType[]) => {
  console.log('\x1b[36m', padMessage('⚡️ Generating Random Users'));

  const firebaseUsers: FirebaseUser[] = [];
  const users: UserType[] = [];
  const usersIds: UserType['_id'][] = [];

  for (let i = 0; i < amount; i++) {
    const postulant = postulants[i];
    const email = faker.internet.email(undefined, undefined, 'getnada.com');
    const firebaseUser = randomFirebaseUser(email);
    firebaseUsers.push(firebaseUser);
    const user = randomUser({
      uid: firebaseUser.uid,
      isNewUser: firebaseUser.isNewUser,
      email,
      postulantId: postulant._id,
    });
    users.push(user);
    usersIds.push(user._id);
  }

  return { firebaseUsers, users, usersIds };
};
