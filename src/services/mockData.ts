import { Department, Grievance, GrievanceCategory, GrievanceStatus, PriorityLevel, StatusLog } from '@/types';

export const departments: Department[] = [
  { id: 'dept-1', name: 'IT Services', description: 'Technical support and IT infrastructure' },
  { id: 'dept-2', name: 'Academic Affairs', description: 'Academic policies and curriculum' },
  { id: 'dept-3', name: 'Infrastructure', description: 'Buildings and facilities management' },
  { id: 'dept-4', name: 'Hostel Management', description: 'Student housing and accommodation' },
  { id: 'dept-5', name: 'Library Services', description: 'Library resources and access' },
  { id: 'dept-6', name: 'Transport', description: 'Campus transportation services' },
  { id: 'dept-7', name: 'Finance', description: 'Fees and financial matters' },
  { id: 'dept-8', name: 'Administration', description: 'General administrative services' },
];

export const categoryToDepartment: Record<GrievanceCategory, string> = {
  'IT': 'dept-1',
  'Academic': 'dept-2',
  'Infrastructure': 'dept-3',
  'Hostel': 'dept-4',
  'Library': 'dept-5',
  'Transport': 'dept-6',
  'Finance': 'dept-7',
  'Administration': 'dept-8',
  'Other': 'dept-8',
};

export const mockGrievances: Grievance[] = [
  {
    id: 'grv-1',
    studentId: '1',
    studentName: 'John Student',
    grievanceText: 'WiFi connection is very slow in the main library building. It has been like this for the past two weeks and it is affecting my research work.',
    predictedCategory: 'IT',
    departmentId: 'dept-1',
    departmentName: 'IT Services',
    status: 'In Progress',
    priorityLevel: 'High',
    confidenceScore: 0.92,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'grv-2',
    studentId: '1',
    studentName: 'John Student',
    grievanceText: 'The AC in my hostel room (Block B, Room 204) is not working properly. It makes a loud noise and does not cool effectively.',
    predictedCategory: 'Hostel',
    departmentId: 'dept-4',
    departmentName: 'Hostel Management',
    status: 'Pending',
    priorityLevel: 'Medium',
    confidenceScore: 0.87,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'grv-3',
    studentId: '4',
    studentName: 'Alice Smith',
    grievanceText: 'I have not received my scholarship amount for this semester. The finance office says it is processed but nothing has been credited to my account.',
    predictedCategory: 'Finance',
    departmentId: 'dept-7',
    departmentName: 'Finance',
    status: 'Resolved',
    priorityLevel: 'High',
    confidenceScore: 0.95,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: 'grv-4',
    studentId: '5',
    studentName: 'Bob Johnson',
    grievanceText: 'The campus bus timing for Route 3 is very inconvenient. It arrives too early in the morning and leaves too late in the evening.',
    predictedCategory: 'Transport',
    departmentId: 'dept-6',
    departmentName: 'Transport',
    status: 'Pending',
    priorityLevel: 'Low',
    confidenceScore: 0.89,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: 'grv-5',
    studentId: '6',
    studentName: 'Carol Williams',
    grievanceText: 'The projector in Lecture Hall 5 has been broken for a week now. Professors are having difficulty delivering lectures effectively.',
    predictedCategory: 'Infrastructure',
    departmentId: 'dept-3',
    departmentName: 'Infrastructure',
    status: 'Escalated',
    priorityLevel: 'High',
    confidenceScore: 0.78,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
  },
];

export const mockStatusLogs: StatusLog[] = [
  {
    id: 'log-1',
    grievanceId: 'grv-1',
    status: 'Pending',
    remarks: 'Grievance received and acknowledged',
    updatedBy: 'System',
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'log-2',
    grievanceId: 'grv-1',
    status: 'In Progress',
    remarks: 'IT team is investigating the WiFi infrastructure in the library',
    updatedBy: 'Dr. Jane Faculty',
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'log-3',
    grievanceId: 'grv-3',
    status: 'Pending',
    remarks: 'Grievance received and acknowledged',
    updatedBy: 'System',
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: 'log-4',
    grievanceId: 'grv-3',
    status: 'In Progress',
    remarks: 'Verifying with bank records',
    updatedBy: 'Finance Coordinator',
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: 'log-5',
    grievanceId: 'grv-3',
    status: 'Resolved',
    remarks: 'Amount credited successfully. Please check your account.',
    updatedBy: 'Finance Coordinator',
    updatedAt: new Date('2024-01-08'),
  },
];

export function getDepartmentById(id: string): Department | undefined {
  return departments.find(d => d.id === id);
}

export function getGrievancesByStudentId(studentId: string): Grievance[] {
  return mockGrievances.filter(g => g.studentId === studentId);
}

export function getGrievancesByDepartmentId(departmentId: string): Grievance[] {
  return mockGrievances.filter(g => g.departmentId === departmentId);
}

export function getStatusLogsByGrievanceId(grievanceId: string): StatusLog[] {
  return mockStatusLogs.filter(l => l.grievanceId === grievanceId);
}
