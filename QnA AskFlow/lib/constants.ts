export interface CourseSeed {
  code: string;
  name: string;
  year: number;
  term: number;
  teacherId: string;
}

export const COURSE_CATALOG: CourseSeed[] = [
  // Year 1 - Term 1
  { code: 'CSE1101', name: 'Structured Programming', year: 1, term: 1, teacherId: 'cse-1101-0' },
  { code: 'CSE1107', name: 'Discrete Mathematics', year: 1, term: 1, teacherId: 'cse-1107-0' },
  { code: 'PHY1107', name: 'Physics', year: 1, term: 1, teacherId: 'phy-1107-0' },
  { code: 'MATH1107', name: 'Differential and Integral Calculus', year: 1, term: 1, teacherId: 'math-1107-0' },
  { code: 'HUM1107', name: 'English and Human Communication', year: 1, term: 1, teacherId: 'hum-1107-0' },

  // Year 1 - Term 2
  { code: 'CSE1201', name: 'Structured Programming', year: 1, term: 2, teacherId: 'cse-1201-0' },
  { code: 'CSE1203', name: 'Digital Logic Design', year: 1, term: 2, teacherId: 'cse-1203-0' },
  { code: 'CHEM1207', name: 'Chemistry', year: 1, term: 2, teacherId: 'chem-1207-0' },
  { code: 'EEE1217', name: 'Analog Electronics', year: 1, term: 2, teacherId: 'eee-1217-0' },
  { code: 'MATH1207', name: 'Coordinate Geometry and Differential Equations', year: 1, term: 2, teacherId: 'math-1207-0' },

  // Year 2 - Term 1
  { code: 'CSE2101', name: 'Object Oriented Programming', year: 2, term: 1, teacherId: 'cse-2101-0' },
  { code: 'CSE2105', name: 'Data Structures and Algorithms', year: 2, term: 1, teacherId: 'cse-2105-0' },
  { code: 'CSE2113', name: 'Computer Architecture', year: 2, term: 1, teacherId: 'cse-2113-0' },
  { code: 'EEE2113', name: 'Digital Electronics', year: 2, term: 1, teacherId: 'eee-2113-0' },
  { code: 'MATH2107', name: 'Fourier Analysis and Linear Algebra', year: 2, term: 1, teacherId: 'math-2107-0' },

  // Year 2 - Term 2
  { code: 'CSE2201', name: 'Algorithm Analysis and Design', year: 2, term: 2, teacherId: 'cse-2201-0' },
  { code: 'CSE2203', name: 'Microprocessors and Microcontrollers', year: 2, term: 2, teacherId: 'cse-2203-0' },
  { code: 'CSE2207', name: 'Numerical Methods', year: 2, term: 2, teacherId: 'cse-2207-0' },
  { code: 'HUM2207', name: 'Economics and Accounting', year: 2, term: 2, teacherId: 'hum-2207-0' },
  { code: 'MATH2207', name: 'Complex Variable, Vector Analysis and Statistics', year: 2, term: 2, teacherId: 'math-2207-0' },

  // Year 3 - Term 1
  { code: 'CSE3101', name: 'Theory of Computation', year: 3, term: 1, teacherId: 'cse-3101-0' },
  { code: 'CSE3103', name: 'Peripherals and Interfacing', year: 3, term: 1, teacherId: 'cse-3103-0' },
  { code: 'CSE3109', name: 'Database Systems', year: 3, term: 1, teacherId: 'cse-3109-0' },
  { code: 'CSE3119', name: 'Software Engineering and Information Systems', year: 3, term: 1, teacherId: 'cse-3119-0' },
  { code: 'ECE3115', name: 'Data Communication', year: 3, term: 1, teacherId: 'ece-3115-0' },

  // Year 3 - Term 2
  { code: 'CSE3201', name: 'Operating Systems', year: 3, term: 2, teacherId: 'cse-3201-0' },
  { code: 'CSE3207', name: 'Applied Statistics and Queuing Theory', year: 3, term: 2, teacherId: 'cse-3207-0' },
  { code: 'CSE3211', name: 'Compiler Design', year: 3, term: 2, teacherId: 'cse-3211-0' },
  { code: 'CSE3217', name: 'Mobile Computing', year: 3, term: 2, teacherId: 'cse-3217-0' },
  { code: 'HUM3207', name: 'Sociology and Government', year: 3, term: 2, teacherId: 'hum-3207-0' },

  // Year 4 - Term 1
  { code: 'CSE4105', name: 'Computer Networks', year: 4, term: 1, teacherId: 'cse-4105-0' },
  { code: 'CSE4109', name: 'Machine Learning', year: 4, term: 1, teacherId: 'cse-4109-0' },
  { code: 'CSE4111', name: 'Machine Learning', year: 4, term: 1, teacherId: 'cse-4111-0' },
  { code: 'CSE4115', name: 'Computer and Network Security', year: 4, term: 1, teacherId: 'cse-4115-0' },
  { code: 'IEM4127', name: 'Industrial Management', year: 4, term: 1, teacherId: 'iem-4127-0' },
  { code: 'CSE4127', name: 'Computer Vision & Image Processing', year: 4, term: 1, teacherId: 'cse-4127-0' },

  // Year 4 - Term 2
  { code: 'CSE4207', name: 'Computer Graphics', year: 4, term: 2, teacherId: 'cse-4207-0' },
  { code: 'CSE4211', name: 'Machine Learning', year: 4, term: 2, teacherId: 'cse-4211-0' },
  { code: 'CSE4215', name: 'Information Security and Control', year: 4, term: 2, teacherId: 'cse-4215-0' },
  { code: 'CSE4239', name: 'Data Mining', year: 4, term: 2, teacherId: 'cse-4239-0' },
  { code: 'HUM4207', name: 'Sociology and Government', year: 4, term: 2, teacherId: 'hum-4207-0' },
  { code: 'IEM4227', name: 'Industrial Management', year: 4, term: 2, teacherId: 'iem-4227-0' },
];

export function getCoursesByYearAndTerm(year: number, term: number): CourseSeed[] {
  return COURSE_CATALOG.filter((c) => c.year === year && c.term === term);
}
