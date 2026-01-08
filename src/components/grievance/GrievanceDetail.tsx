import { Grievance, StatusLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Building2, 
  User, 
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface GrievanceDetailProps {
  grievance: Grievance;
  statusLogs: StatusLog[];
}

export function GrievanceDetail({ grievance, statusLogs }: GrievanceDetailProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4 text-status-pending" />;
      case 'In Progress':
        return <Loader2 className="h-4 w-4 text-status-in-progress" />;
      case 'Resolved':
        return <CheckCircle2 className="h-4 w-4 text-status-resolved" />;
      case 'Escalated':
        return <AlertTriangle className="h-4 w-4 text-status-escalated" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Details */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">Grievance Details</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Submitted on {format(grievance.createdAt, 'PPP')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(grievance.status) as any}>
                {grievance.status}
              </Badge>
              <Badge variant={getPriorityVariant(grievance.priorityLevel) as any}>
                {grievance.priorityLevel} Priority
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Grievance Text */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-foreground leading-relaxed">{grievance.grievanceText}</p>
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Department</p>
                <p className="font-medium">{grievance.departmentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Category</p>
                <p className="font-medium">{grievance.predictedCategory}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Student</p>
                <p className="font-medium">{grievance.studentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">AI Confidence</p>
                <p className="font-medium">{Math.round(grievance.confidenceScore * 100)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg">Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {statusLogs.map((log, index) => (
                <div key={log.id} className="relative flex gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background border-2 border-border z-10">
                    {getStatusIcon(log.status)}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(log.status) as any} className="text-xs">
                        {log.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(log.updatedAt, 'PPp')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{log.remarks}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Updated by {log.updatedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
