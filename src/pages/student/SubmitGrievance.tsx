import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SubmitGrievanceForm } from '@/components/grievance/SubmitGrievanceForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GrievanceCategory } from '@/types';

export default function SubmitGrievance() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (
    grievanceText: string,
    category: GrievanceCategory,
    departmentId: string,
    priority: string,
    confidence: number
  ) => {
    // In a real app, this would save to the database
    console.log('Submitting grievance:', {
      studentId: user?.id,
      grievanceText,
      category,
      departmentId,
      priority,
      confidence,
    });

    // Navigate to grievances list
    setTimeout(() => {
      navigate('/student/grievances');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold">Submit a Grievance</h1>
          <p className="text-muted-foreground mt-2">
            Describe your issue and our AI will automatically classify and route it to the appropriate department.
          </p>
        </div>

        {/* Form */}
        <SubmitGrievanceForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
}
