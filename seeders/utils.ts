import firebaseAdmin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

import { FirebaseUser } from '../src/interfaces/firebase';

export const padMessage = (message: string, startLength = 20, endLength = 45) => {
  return '|'.padEnd(startLength, '-') + ` ${message} `.padEnd(endLength, '-') + '|';
};

export const listAndRemoveAllUsers = async (nextPageToken?: string) => {
  try {
    const listUsersResult = await firebaseAdmin.auth().listUsers(1000, nextPageToken);
    const usersUids = listUsersResult.users.map((userRecord) => userRecord.uid);
    const usersRemoved = await firebaseAdmin.auth().deleteUsers(usersUids);
    usersRemoved.errors.forEach((err) => {
      console.log('Error while removing: ', err.error.toJSON());
    });
    if (listUsersResult.pageToken) {
      await listAndRemoveAllUsers(listUsersResult.pageToken);
    }
    console.log('\x1b[37m', padMessage('🚀 Firebase Users Removed'));
  } catch (error) {
    console.log('\x1b[31m', '🛑 Error listing users:', '\x1b[0m', error);
    throw error;
  }
};

export const addUser = async (user: FirebaseUser, timeout: number) => {
  return new Promise((resolve: (value: UserRecord) => void, reject) =>
    setTimeout(async () => {
      try {
        const userType = user.type;
        const isNewUser = user.isNewUser;
        const userCreated = await firebaseAdmin.auth().createUser({ ...user });
        await firebaseAdmin.auth().setCustomUserClaims(userCreated.uid, { userType, isNewUser });
        resolve(userCreated);
      } catch (error) {
        console.log('\x1b[31m', `🛑 Error adding user: ${user.email} \n`, '\x1b[0m', error);
        reject(error);
      }
    }, timeout),
  );
};

export const listAndAddAllUsers = async (firebaseUsers: FirebaseUser[]) => {
  try {
    let timeout = 0;
    const users: UserRecord[] = [];
    console.log('\x1b[36m', padMessage('⚡️ Adding Firebase Users'));
    for (let i = 0; i < firebaseUsers.length; i++) {
      timeout = timeout + 1;
      console.log('\x1b[36m', padMessage(`User ${i + 1}: ${firebaseUsers[i].email}`, 10, 55));
      const user = await addUser(firebaseUsers[i], timeout);
      users.push(user);
    }
    console.log('\n\x1b[37m', padMessage('🚀 Firebase Users Added'));
    return users;
  } catch (error) {
    console.log('\x1b[31m', '🛑 Error adding users', '\x1b[0m', error);
    throw error;
  }
};
