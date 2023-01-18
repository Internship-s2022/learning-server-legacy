import CourseUser from 'src/models/course-user';
import { filterIncludeArrayOfIds } from 'src/utils/query';

export const validateAtLeastOneRole = async (role: string, courseUsers: string[]) => {
  const cUsers = await CourseUser.find(filterIncludeArrayOfIds(courseUsers));
  return cUsers.some((cUser) => cUser.role === role);
};
