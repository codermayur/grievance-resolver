import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/stats/StatsCard';
import { GrievanceCard } from '@/components/grievance/GrievanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getGrievancesByStudentId, mockGrievances } from '@/services/mockData';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const grievances = user ? getGrievancesByStudentId(user.id) : mockGrievances.slice(0, 2);

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === 'Pending').length,
    inProgress: grievances.filter(g => g.status === 'In Progress').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
  };

  const recentGrievances = grievances.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-muted-foreground mt-1">Here's an overview of your grievances</p>
          </div>
          <Link to="/student/submit">
            <Button variant="hero" size="lg">
              <Plus className="h-5 w-5" />
              New Grievance
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Submitted"
            value={stats.total}
            description="All time grievances"
            icon={FileText}
            variant="primary"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            description="Awaiting review"
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            description="Being addressed"
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

        {/* Recent Grievances */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Grievances</CardTitle>
            <Link to="/student/grievances">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentGrievances.length > 0 ? (
              <div className="space-y-4">
                {recentGrievances.map((grievance) => (
                  <GrievanceCard key={grievance.id} grievance={grievance} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No grievances yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't submitted any grievances. Start by creating one.
                </p>
                <Link to="/student/submit">
                  <Button variant="gradient">
                    <Plus className="h-4 w-4" />
                    Submit Your First Grievance
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card variant="gradient" className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Tips for Effective Grievances</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific and provide detailed descriptions</li>
                  <li>• Include relevant dates, locations, and names when applicable</li>
                  <li>• Our AI works better with clear, well-written text</li>
                  <li>• Check your status regularly for updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
