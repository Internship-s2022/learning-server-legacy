import { UserDocument } from 'src/models/user';

export interface FailedType {
  postulantId: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
}

export interface SuccessfulType {
  postulantId: string | undefined;
  user: UserDocument;
  credentials: { email: string; newPassword: string; firebaseUid: string } | undefined;
}
