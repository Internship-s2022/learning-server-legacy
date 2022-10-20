export interface FirebaseUser {
  uid: string;
  email: string;
  password: string;
  type: 'SUPER_ADMIN' | 'NORMAL';
}
