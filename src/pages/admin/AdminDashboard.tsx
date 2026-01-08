import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/stats/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockGrievances, departments } from '@/services/mockData';
import { 
  FileText, 
  Users, 
  Building2, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const grievances = mockGrievances;

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === 'Pending').length,
    inProgress: grievances.filter(g => g.status === 'In Progress').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
    escalated: grievances.filter(g => g.status === 'Escalated').length,
  };

  // Category distribution data
  const categoryData = departments.map(dept => ({
    name: dept.name.replace(' Services', '').replace(' Management', '').replace(' Affairs', ''),
    count: grievances.filter(g => g.departmentId === dept.id).length,
  })).filter(d => d.count > 0);

  // Status distribution for pie chart
  const statusData = [
    { name: 'Pending', value: stats.pending, color: 'hsl(38, 92%, 50%)' },
    { name: 'In Progress', value: stats.inProgress, color: 'hsl(217, 91%, 60%)' },
    { name: 'Resolved', value: stats.resolved, color: 'hsl(142, 71%, 45%)' },
    { name: 'Escalated', value: stats.escalated, color: 'hsl(0, 84%, 60%)' },
  ].filter(d => d.value > 0);

  const recentEscalated = grievances.filter(g => g.status === 'Escalated').slice(0, 2);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              System-wide overview and management
            </p>
          </div>
          <Link to="/admin/analytics">
            <Button variant="hero">
              <BarChart3 className="h-5 w-5" />
              View Analytics
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Total Grievances"
            value={stats.total}
            icon={FileText}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={TrendingUp}
            variant="accent"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            variant="success"
          />
          <StatsCard
            title="Escalated"
            value={stats.escalated}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Distribution */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Grievances by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80} 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Escalated */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/users" className="block">
                <Card variant="interactive" className="group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-role-admin/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-role-admin" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">
                          Manage Users
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add students and faculty
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/departments" className="block">
                <Card variant="interactive" className="group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">
                          Manage Departments
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {departments.length} departments configured
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/grievances" className="block">
                <Card variant="interactive" className="group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium group-hover:text-primary transition-colors">
                          All Grievances
                        </p>
                        <p className="text-sm text-muted-foreground">
                          View and manage all grievances
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CardContent>
          </Card>

          {/* Escalated Grievances */}
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-escalated" />
                Escalated Grievances
              </CardTitle>
              <Link to="/admin/grievances?status=Escalated">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentEscalated.length > 0 ? (
                <div className="space-y-4">
                  {recentEscalated.map((grievance) => (
                    <div
                      key={grievance.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-status-escalated-bg/50 border border-status-escalated/20"
                    >
                      <AlertTriangle className="h-5 w-5 text-status-escalated mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{grievance.grievanceText}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="escalated">Escalated</Badge>
                          <span className="text-xs text-muted-foreground">
                            {grievance.departmentName}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-status-resolved mx-auto mb-4" />
                  <p className="text-muted-foreground">No escalated grievances</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
