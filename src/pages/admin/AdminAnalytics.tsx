import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/stats/StatsCard';
import { mockGrievances, departments } from '@/services/mockData';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Timer,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export default function AdminAnalytics() {
  const grievances = mockGrievances;

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === 'Pending').length,
    inProgress: grievances.filter(g => g.status === 'In Progress').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
    escalated: grievances.filter(g => g.status === 'Escalated').length,
    avgResolutionTime: 3.5, // Mock value in days
  };

  // Category distribution data
  const categoryData = [
    { name: 'IT', count: 2, fill: 'hsl(226, 70%, 45%)' },
    { name: 'Academic', count: 1, fill: 'hsl(174, 60%, 40%)' },
    { name: 'Hostel', count: 2, fill: 'hsl(38, 92%, 50%)' },
    { name: 'Finance', count: 1, fill: 'hsl(142, 71%, 45%)' },
    { name: 'Transport', count: 1, fill: 'hsl(271, 81%, 56%)' },
    { name: 'Infrastructure', count: 1, fill: 'hsl(0, 84%, 60%)' },
  ];

  // Status distribution for pie chart
  const statusData = [
    { name: 'Pending', value: stats.pending, color: 'hsl(38, 92%, 50%)' },
    { name: 'In Progress', value: stats.inProgress, color: 'hsl(217, 91%, 60%)' },
    { name: 'Resolved', value: stats.resolved, color: 'hsl(142, 71%, 45%)' },
    { name: 'Escalated', value: stats.escalated, color: 'hsl(0, 84%, 60%)' },
  ].filter(d => d.value > 0);

  // Monthly trend data (mock)
  const monthlyData = [
    { month: 'Sep', submitted: 12, resolved: 10 },
    { month: 'Oct', submitted: 18, resolved: 15 },
    { month: 'Nov', submitted: 22, resolved: 18 },
    { month: 'Dec', submitted: 15, resolved: 14 },
    { month: 'Jan', submitted: 28, resolved: 20 },
  ];

  // Department workload
  const departmentWorkload = departments.map(dept => ({
    name: dept.name.replace(' Services', '').replace(' Management', '').replace(' Affairs', ''),
    pending: grievances.filter(g => g.departmentId === dept.id && g.status === 'Pending').length,
    inProgress: grievances.filter(g => g.departmentId === dept.id && g.status === 'In Progress').length,
    resolved: grievances.filter(g => g.departmentId === dept.id && g.status === 'Resolved').length,
  })).filter(d => d.pending + d.inProgress + d.resolved > 0);

  // Priority distribution
  const priorityData = [
    { name: 'High', value: grievances.filter(g => g.priorityLevel === 'High').length, color: 'hsl(0, 84%, 60%)' },
    { name: 'Medium', value: grievances.filter(g => g.priorityLevel === 'Medium').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Low', value: grievances.filter(g => g.priorityLevel === 'Low').length, color: 'hsl(142, 71%, 45%)' },
  ];

  // AI confidence distribution (mock)
  const confidenceData = [
    { range: '50-60%', count: 1 },
    { range: '60-70%', count: 1 },
    { range: '70-80%', count: 2 },
    { range: '80-90%', count: 3 },
    { range: '90-100%', count: 5 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Grievances"
            value={stats.total}
            icon={FileText}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Resolution Rate"
            value={`${Math.round((stats.resolved / stats.total) * 100)}%`}
            icon={CheckCircle2}
            variant="success"
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Avg. Resolution Time"
            value={`${stats.avgResolutionTime} days`}
            icon={Timer}
            variant="accent"
            trend={{ value: 8, isPositive: false }}
          />
          <StatsCard
            title="Escalation Rate"
            value={`${Math.round((stats.escalated / stats.total) * 100)}%`}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Main Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Trend */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Monthly Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="submitted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(226, 70%, 45%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(226, 70%, 45%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="resolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="submitted" 
                      stroke="hsl(226, 70%, 45%)" 
                      fillOpacity={1}
                      fill="url(#submitted)"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="resolved" 
                      stroke="hsl(142, 71%, 45%)" 
                      fillOpacity={1}
                      fill="url(#resolved)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Department Workload */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Department Workload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentWorkload}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inProgress" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Classification Confidence */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                AI Classification Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={confidenceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(174, 60%, 40%)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority & Category Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Priority Distribution */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priorityData.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(item.value / stats.total) * 100}%`,
                            backgroundColor: item.color 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card variant="elevated" className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
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
                      radius={[0, 4, 4, 0]}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
