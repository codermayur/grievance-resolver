import { Grievance } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Building2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface GrievanceCardProps {
  grievance: Grievance;
  onClick?: () => void;
  showStudent?: boolean;
}

export function GrievanceCard({ grievance, onClick, showStudent = false }: GrievanceCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'pending';
      case 'In Progress':
        return 'in-progress';
      case 'Resolved':
        return 'resolved';
      case 'Escalated':
        return 'escalated';
      default:
        return 'default';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'low';
      case 'Medium':
        return 'medium';
      case 'High':
        return 'high';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      variant="interactive" 
      onClick={onClick}
      className="group"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getStatusVariant(grievance.status) as any}>
                {grievance.status}
              </Badge>
              <Badge variant={getPriorityVariant(grievance.priorityLevel) as any}>
                {grievance.priorityLevel}
              </Badge>
            </div>
            <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {grievance.grievanceText}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              {grievance.predictedCategory}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(grievance.confidenceScore * 100)}% confident
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              <span>{grievance.departmentName}</span>
            </div>
            {showStudent && (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{grievance.studentName}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(grievance.createdAt, { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
