import mongoose, { PipelineStage } from 'mongoose';

import { SortType } from 'src/interfaces/request';
import CourseUser from 'src/models/course-user';
import Group, { GroupType } from 'src/models/group';
import { filterExcludeArrayOfIds, paginateAndFilter } from 'src/utils/query';

const getGroupsByModulesIds = (
  query: qs.ParsedQs | { [k: string]: mongoose.Types.ObjectId },
  modulesIds: string[],
) => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        ...query,
        $or: modulesIds.map((id) => ({ modules: { $in: [new mongoose.Types.ObjectId(id)] } })),
      },
    },
  ];

  return pipeline;
};

const getUserBasedOnCoursePipeline = (
  query: qs.ParsedQs | { [k: string]: unknown },
  sort?: SortType,
) => {
  const pipeline: PipelineStage[] = [
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user' } },
    {
      $lookup: {
        from: 'postulants',
        localField: 'user.postulant',
        foreignField: '_id',
        as: 'user.postulant',
      },
    },
    { $unwind: { path: '$user.postulant' } },
    { $match: query },
  ];

  if (sort) {
    pipeline.push({ $sort: sort });
  }

  return pipeline;
};

export const getCourseUsersExcludeByModules = async (
  courseId: mongoose.Types.ObjectId,
  modules: string[],
  reqQuery: qs.ParsedQs,
) => {
  const groups = await Group.aggregate<GroupType>(
    getGroupsByModulesIds({ course: new mongoose.Types.ObjectId(courseId) }, modules),
  );
  const cUsersIds: string[] = groups.reduce<string[]>((prev, { courseUsers }) => {
    courseUsers.map(({ _id }) => {
      if (!prev.includes(_id.toString())) {
        prev.push(_id.toString());
      }
    });
    return prev;
  }, []);
  const { page, limit, query, sort } = paginateAndFilter(reqQuery);
  const courseUserAggregate = CourseUser.aggregate(
    getUserBasedOnCoursePipeline(
      {
        ...query,
        ...(cUsersIds.length && filterExcludeArrayOfIds(cUsersIds)),
        course: new mongoose.Types.ObjectId(courseId),
        isActive: true,
      },
      sort,
    ),
  );
  const { docs, ...pagination } = await CourseUser.aggregatePaginate(courseUserAggregate, {
    page,
    limit,
  });
  return { docs, pagination };
};
