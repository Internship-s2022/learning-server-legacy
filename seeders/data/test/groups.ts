import mongoose from 'mongoose';

import { GroupType } from '../../../src/models/group';

const groups: GroupType[] = [
  {
    _id: new mongoose.Types.ObjectId('637517be650676f3da007f00'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    name: 'Grupo 1',
    type: 'DEV',
    modules: [
      new mongoose.Types.ObjectId('637517be650676f3da006f00'),
      new mongoose.Types.ObjectId('637517be650676f3da006f01'),
      new mongoose.Types.ObjectId('637517be650676f3da006f02'),
      new mongoose.Types.ObjectId('637517be650676f3da006f03'),
    ],
    courseUsers: [
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400001'),
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400002'),
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400003'),
      new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400004'),
    ],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('637517be650676f3da007f01'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    name: 'Grupo 2',
    type: 'DEV',
    modules: [
      new mongoose.Types.ObjectId('637517be650676f3da006f00'),
      new mongoose.Types.ObjectId('637517be650676f3da006f02'),
    ],
    courseUsers: [new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400001')],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('637517be650676f3da007f02'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    name: 'Grupo 3',
    type: 'DEV',
    modules: [
      new mongoose.Types.ObjectId('637517be650676f3da006f00'),
      new mongoose.Types.ObjectId('637517be650676f3da006f02'),
    ],
    courseUsers: [new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400001')],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('637517be650676f3da007f03'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    name: 'Grupo 4',
    type: 'DEV',
    modules: [
      new mongoose.Types.ObjectId('637517be650676f3da006f00'),
      new mongoose.Types.ObjectId('637517be650676f3da006f03'),
    ],
    courseUsers: [new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400001')],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('637517be650676f3da007f04'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    name: 'Grupo 5',
    type: 'DEV',
    modules: [
      new mongoose.Types.ObjectId('637517be650676f3da006f00'),
      new mongoose.Types.ObjectId('637517be650676f3da006f03'),
    ],
    courseUsers: [new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400001')],
    isActive: true,
  },
];

export default groups;
