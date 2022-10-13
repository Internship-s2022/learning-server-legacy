import { Request } from 'express';
//TO-DO: use type firebase user
export enum FirebaseUser {
  SUPERADMIN = 'SUPERADMIN',
  NORMAL = 'NORMAL',
}

export interface RequestWithFirebase extends Request {
  firebaseUid?: string;
}
