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
    email: 'franco.marini@radiumrocket.com',
    password: 'password123',
    type: 'NORMAL',
    isNewUser: false,
  },
  {
    uid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN12',
    email: 'agustin.chazaretta@radiumrocket.com',
    password: 'password123',
    type: 'NORMAL',
    isNewUser: true,
  },
  {
    uid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN13',
    email: 'guido.cerioni@radiumrocket.com',
    password: 'password123',
    type: 'NORMAL',
    isNewUser: true,
  },
  {
    uid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN14',
    email: 'iara.criscenti@radiumrocket.com',
    password: 'password123',
    type: 'NORMAL',
    isNewUser: true,
  },
  {
    uid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN15',
    email: 'julian.demeglio@radiumrocket.com',
    password: 'password123',
    type: 'NORMAL',
    isNewUser: true,
  },
];

export default firebaseUsers;
