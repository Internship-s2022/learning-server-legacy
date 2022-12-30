import mongoose from 'mongoose';

import { ModuleType } from '../../../src/models/module';

const modules: ModuleType[] = [
  {
    _id: new mongoose.Types.ObjectId('637517be650676f3da006f00'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    name: 'Modulo 1',
    description: 'This is the first module.',
    status: 'COMPLETED',
    type: 'DEV',
    groups: [
      new mongoose.Types.ObjectId('637517be650676f3da007f00'),
      new mongoose.Types.ObjectId('637517be650676f3da007f03'),
    ],
    contents: ['Node JS', 'React'],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('637517be650676f3da006f01'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    name: 'Modulo 2',
    description: 'This is the second module.',
    status: 'IN_PROGRESS',
    type: 'DEV',
    groups: [new mongoose.Types.ObjectId('637517be650676f3da007f00')],
    contents: ['Node JS', 'React'],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('637517be650676f3da006f02'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    name: 'Modulo 3',
    description: 'This is the third module.',
    status: 'PENDING',
    type: 'DEV',
    groups: [
      new mongoose.Types.ObjectId('637517be650676f3da007f00'),
      new mongoose.Types.ObjectId('637517be650676f3da007f01'),
      new mongoose.Types.ObjectId('637517be650676f3da007f02'),
    ],
    contents: ['Node JS', 'React'],
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('637517be650676f3da006f03'),
    course: new mongoose.Types.ObjectId('1e063109a88495b45758c006'),
    name: 'Modulo 4',
    description: 'This is the fourth module.',
    status: 'PENDING',
    type: 'DEV',
    groups: [
      new mongoose.Types.ObjectId('637517be650676f3da007f00'),
      new mongoose.Types.ObjectId('637517be650676f3da007f03'),
      new mongoose.Types.ObjectId('637517be650676f3da007f04'),
    ],
    contents: ['Node JS', 'React'],
    isActive: false,
  },
];

export default modules;
