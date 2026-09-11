-- Insert initial courses based on the exact PRD Catalog
insert into courses (course_code, course_name, year, term, teacher_id) values
  -- Year 1 - Term 1
  ('CSE1101', 'Structured Programming', 1, 1, 'cse-1101-0'),
  ('CSE1107', 'Discrete Mathematics', 1, 1, 'cse-1107-0'),
  ('PHY1107', 'Physics', 1, 1, 'phy-1107-0'),
  ('MATH1107', 'Differential and Integral Calculus', 1, 1, 'math-1107-0'),
  ('HUM1107', 'English and Human Communication', 1, 1, 'hum-1107-0'),
  
  -- Year 1 - Term 2
  ('CSE1201', 'Structured Programming', 1, 2, 'cse-1201-0'),
  ('CSE1203', 'Digital Logic Design', 1, 2, 'cse-1203-0'),
  ('CHEM1207', 'Chemistry', 1, 2, 'chem-1207-0'),
  ('EEE1217', 'Analog Electronics', 1, 2, 'eee-1217-0'),
  ('MATH1207', 'Coordinate Geometry and Differential Equations', 1, 2, 'math-1207-0'),
  
  -- Year 2 - Term 1
  ('CSE2101', 'Object Oriented Programming', 2, 1, 'cse-2101-0'),
  ('CSE2105', 'Data Structures and Algorithms', 2, 1, 'cse-2105-0'),
  ('CSE2113', 'Computer Architecture', 2, 1, 'cse-2113-0'),
  ('EEE2113', 'Digital Electronics', 2, 1, 'eee-2113-0'),
  ('MATH2107', 'Fourier Analysis and Linear Algebra', 2, 1, 'math-2107-0'),
  
  -- Year 2 - Term 2
  ('CSE2201', 'Algorithm Analysis and Design', 2, 2, 'cse-2201-0'),
  ('CSE2203', 'Microprocessors and Microcontrollers', 2, 2, 'cse-2203-0'),
  ('CSE2207', 'Numerical Methods', 2, 2, 'cse-2207-0'),
  ('HUM2207', 'Economics and Accounting', 2, 2, 'hum-2207-0'),
  ('MATH2207', 'Complex Variable, Vector Analysis and Statistics', 2, 2, 'math-2207-0'),
  
  -- Year 3 - Term 1
  ('CSE3101', 'Theory of Computation', 3, 1, 'cse-3101-0'),
  ('CSE3103', 'Peripherals and Interfacing', 3, 1, 'cse-3103-0'),
  ('CSE3109', 'Database Systems', 3, 1, 'cse-3109-0'),
  ('CSE3119', 'Software Engineering and Information Systems', 3, 1, 'cse-3119-0'),
  ('ECE3115', 'Data Communication', 3, 1, 'ece-3115-0'),
  
  -- Year 3 - Term 2
  ('CSE3201', 'Operating Systems', 3, 2, 'cse-3201-0'),
  ('CSE3207', 'Applied Statistics and Queuing Theory', 3, 2, 'cse-3207-0'),
  ('CSE3211', 'Compiler Design', 3, 2, 'cse-3211-0'),
  ('CSE3217', 'Mobile Computing', 3, 2, 'cse-3217-0'),
  ('HUM3207', 'Sociology and Government', 3, 2, 'hum-3207-0'),
  
  -- Year 4 - Term 1
  ('CSE4105', 'Computer Networks', 4, 1, 'cse-4105-0'),
  ('CSE4109', 'Machine Learning', 4, 1, 'cse-4109-0'),
  ('CSE4111', 'Machine Learning', 4, 1, 'cse-4111-0'),
  ('CSE4115', 'Computer and Network Security', 4, 1, 'cse-4115-0'),
  ('IEM4127', 'Industrial Management', 4, 1, 'iem-4127-0'),
  ('CSE4127', 'Computer Vision & Image Processing', 4, 1, 'cse-4127-0'),
  
  -- Year 4 - Term 2
  ('CSE4207', 'Computer Graphics', 4, 2, 'cse-4207-0'),
  ('CSE4211', 'Machine Learning', 4, 2, 'cse-4211-0'),
  ('CSE4215', 'Information Security and Control', 4, 2, 'cse-4215-0'),
  ('CSE4239', 'Data Mining', 4, 2, 'cse-4239-0'),
  ('HUM4207', 'Sociology and Government', 4, 2, 'hum-4207-0'),
  ('IEM4227', 'Industrial Management', 4, 2, 'iem-4227-0')
on conflict do nothing;
