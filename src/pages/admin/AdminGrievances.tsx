import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { mockGrievances, departments } from '@/services/mockData';
import { GrievanceStatus } from '@/types';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function AdminGrievances() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GrievanceStatus | 'All'>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  const filteredGrievances = mockGrievances.filter(g => {
    const matchesSearch = 
      g.grievanceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || g.departmentId === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleEscalate = (grievanceId: string) => {
    toast({
      title: "Grievance escalated",
      description: "The grievance has been marked as escalated and relevant parties notified.",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'In Progress': return 'in-progress';
      case 'Resolved': return 'resolved';
      case 'Escalated': return 'escalated';
      default: return 'default';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'Low': return 'low';
      case 'Medium': return 'medium';
      case 'High': return 'high';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">All Grievances</h1>
          <p className="text-muted-foreground mt-1">
            System-wide view of all grievances across departments
          </p>
        </div>

        {/* Filters */}
        <Card variant="flat" className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as GrievanceStatus | 'All')}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grievances Table */}
        <Card variant="elevated">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium text-sm">ID</th>
                    <th className="text-left p-4 font-medium text-sm">Student</th>
                    <th className="text-left p-4 font-medium text-sm">Description</th>
                    <th className="text-left p-4 font-medium text-sm">Department</th>
                    <th className="text-left p-4 font-medium text-sm">Category</th>
                    <th className="text-left p-4 font-medium text-sm">Priority</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-sm">Date</th>
                    <th className="text-left p-4 font-medium text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrievances.map((grievance) => (
                    <tr 
                      key={grievance.id} 
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-mono text-sm">{grievance.id}</td>
                      <td className="p-4 font-medium">{grievance.studentName}</td>
                      <td className="p-4 max-w-xs">
                        <p className="text-sm truncate">{grievance.grievanceText}</p>
                      </td>
                      <td className="p-4 text-sm">{grievance.departmentName}</td>
                      <td className="p-4">
                        <Badge variant="default" className="text-xs">
                          {grievance.predictedCategory}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={getPriorityVariant(grievance.priorityLevel) as any}>
                          {grievance.priorityLevel}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusVariant(grievance.status) as any}>
                          {grievance.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {format(grievance.createdAt, 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">
                        {grievance.status !== 'Resolved' && grievance.status !== 'Escalated' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEscalate(grievance.id)}
                            className="text-status-escalated border-status-escalated/30 hover:bg-status-escalated/10"
                          >
                            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                            Escalate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredGrievances.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No grievances match your filters
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
