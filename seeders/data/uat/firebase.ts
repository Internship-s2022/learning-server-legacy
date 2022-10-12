import { FirebaseUser } from '../../../src/interfaces/firebase';

const firebaseUsers: FirebaseUser[] = [
  {
    uid: 'M5MCzG5aCKpf0B7qpNNsi8RyjN15',
    email: process.env.SUPER_ADMIN_EMAIL || 'super.admin@radiumrocket.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'Passw0rd1234',
    type: 'SUPER_ADMIN',
  },
];

export default firebaseUsers;
