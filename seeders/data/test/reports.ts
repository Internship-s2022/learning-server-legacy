import mongoose from 'mongoose';

import { ReportType } from '../../../src/models/report';

const groups: ReportType[] = [
  {
    _id: new mongoose.Types.ObjectId('637517be6506000000007f01'),
    module: new mongoose.Types.ObjectId('637517be650676f3da006f02'),
    courseUser: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400002'),
    assistance: true,
    exams: [{ name: 'Problemática', grade: 8 }],
  },
  {
    _id: new mongoose.Types.ObjectId('637517be6506000000007f02'),
    module: new mongoose.Types.ObjectId('637517be650676f3da006f02'),
    courseUser: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400003'),
    assistance: true,
    exams: [{ name: 'Problemática', grade: 6 }],
  },
  {
    _id: new mongoose.Types.ObjectId('637517be6506000000007f03'),
    module: new mongoose.Types.ObjectId('637517be650676f3da006f02'),
    courseUser: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400004'),
    exams: [{ name: 'Problemática', grade: 5 }],
    assistance: true,
  },
  {
    _id: new mongoose.Types.ObjectId('637517be6506000000007f05'),
    module: new mongoose.Types.ObjectId('637517be650676f3da006f00'),
    courseUser: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400002'),
    exams: [{ name: 'Problemática', grade: 7 }],
    assistance: true,
  },
  {
    _id: new mongoose.Types.ObjectId('637517be6506000000007f06'),
    module: new mongoose.Types.ObjectId('637517be650676f3da006f00'),
    courseUser: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400003'),
    exams: [{ name: 'Problemática', grade: 4 }],
    assistance: true,
  },
  {
    _id: new mongoose.Types.ObjectId('637517be6506000000007f07'),
    module: new mongoose.Types.ObjectId('637517be650676f3da006f00'),
    courseUser: new mongoose.Types.ObjectId('507f1f77bcf86cdcc4400004'),
    exams: [{ name: 'Problemática', grade: 10 }],
    assistance: true,
  },
];

export default groups;
