import { UserDocument } from 'src/models/user';

export interface FailedType {
  postulantId: string | undefined;
  error: any;
}

export interface SuccessfulType {
  postulantId: string | undefined;
  user: UserDocument;
  credentials: { email: string; newPassword: string; firebaseUid: string } | undefined;
}
