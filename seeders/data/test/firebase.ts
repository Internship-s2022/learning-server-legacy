import { FirebaseUser } from '../../../src/interfaces/firebase';

const firebaseUsers: FirebaseUser[] = [
  {
    uid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN10',
    email: process.env.SUPER_ADMIN_EMAIL || 'super.admin@radiumrocket.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'Passw0rd1234',
    type: 'SUPER_ADMIN',
  },
  {
    uid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN11',
    email: 'agustin.chazaretta@radiumrocket.com',
    password: 'asdasd123',
    type: 'NORMAL',
  },
  {
    uid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN12',
    email: 'user@mail.com',
    password: 'Passw0rd1234',
    type: 'NORMAL',
  },
];

export default firebaseUsers;
