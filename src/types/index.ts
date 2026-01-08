export type UserRole = 'student' | 'faculty' | 'admin';

export type GrievanceStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Escalated';

export type PriorityLevel = 'Low' | 'Medium' | 'High';

export type GrievanceCategory = 
  | 'IT'
  | 'Academic'
  | 'Infrastructure'
  | 'Hostel'
  | 'Library'
  | 'Transport'
  | 'Finance'
  | 'Administration'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Grievance {
  id: string;
  studentId: string;
  studentName: string;
  grievanceText: string;
  predictedCategory: GrievanceCategory;
  departmentId: string;
  departmentName: string;
  status: GrievanceStatus;
  priorityLevel: PriorityLevel;
  confidenceScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusLog {
  id: string;
  grievanceId: string;
  status: GrievanceStatus;
  remarks: string;
  updatedBy: string;
  updatedAt: Date;
}

export interface TrainingData {
  id: string;
  grievanceText: string;
  predictedCategory: GrievanceCategory;
  finalCategory: GrievanceCategory;
  confidenceScore: number;
  correctedBy?: string;
  createdAt: Date;
}

export interface AIClassificationResponse {
  category: GrievanceCategory;
  confidence: number;
}

export interface DashboardStats {
  totalGrievances: number;
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  escalatedCount: number;
  averageResolutionTime: number;
}
