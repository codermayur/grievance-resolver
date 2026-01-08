import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/stats/StatsCard';
import { GrievanceCard } from '@/components/grievance/GrievanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getGrievancesByDepartmentId, getDepartmentById, mockGrievances } from '@/services/mockData';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FacultyDashboard() {
  const { user } = useAuth();
  
  // For demo, use dept-1 (IT Services)
  const departmentId = user?.departmentId || 'dept-1';
  const department = getDepartmentById(departmentId);
  const grievances = getGrievancesByDepartmentId(departmentId);

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === 'Pending').length,
    inProgress: grievances.filter(g => g.status === 'In Progress').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
  };

  const activeGrievances = grievances.filter(g => 
    g.status === 'Pending' || g.status === 'In Progress'
  ).slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Building2 className="h-4 w-4" />
              <span>{department?.name || 'IT Services'}</span>
            </div>
            <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage grievances assigned to your department
            </p>
          </div>
          <Link to="/faculty/grievances">
            <Button variant="hero">
              <ClipboardList className="h-5 w-5" />
              View All Grievances
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Assigned"
            value={stats.total}
            description="Department grievances"
            icon={ClipboardList}
            variant="primary"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            description="Need attention"
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            description="Currently working"
            icon={AlertTriangle}
            variant="accent"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            description="Successfully closed"
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Active Grievances */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Grievances</CardTitle>
            <Link to="/faculty/grievances">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activeGrievances.length > 0 ? (
              <div className="space-y-4">
                {activeGrievances.map((grievance) => (
                  <GrievanceCard 
                    key={grievance.id} 
                    grievance={grievance} 
                    showStudent 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-status-resolved mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  No pending grievances in your department.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card variant="interactive" className="group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-status-pending/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-status-pending" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    Pending Grievances
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.pending} grievances awaiting your review
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card variant="interactive" className="group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-status-in-progress/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-status-in-progress" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    In Progress
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.inProgress} grievances currently being handled
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
