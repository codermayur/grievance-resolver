import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getGrievancesByDepartmentId, 
  getDepartmentById, 
  getStatusLogsByGrievanceId 
} from '@/services/mockData';
import { Grievance, GrievanceStatus, GrievanceCategory } from '@/types';
import { 
  Search, 
  Filter,
  Building2,
  Clock,
  User,
  MessageSquare,
  Save,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function FacultyGrievances() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const departmentId = user?.departmentId || 'dept-1';
  const department = getDepartmentById(departmentId);
  const grievances = getGrievancesByDepartmentId(departmentId);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GrievanceStatus | 'All'>('All');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [newStatus, setNewStatus] = useState<GrievanceStatus | ''>('');
  const [remarks, setRemarks] = useState('');
  const [correctedCategory, setCorrectedCategory] = useState<GrievanceCategory | ''>('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = g.grievanceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: (GrievanceStatus | 'All')[] = ['All', 'Pending', 'In Progress', 'Resolved', 'Escalated'];
  const categories: GrievanceCategory[] = [
    'IT', 'Academic', 'Infrastructure', 'Hostel', 'Library', 'Transport', 'Finance', 'Administration', 'Other'
  ];

  const handleOpenGrievance = (grievance: Grievance) => {
    setSelectedGrievance(grievance);
    setNewStatus(grievance.status);
    setRemarks('');
    setCorrectedCategory('');
  };

  const handleSave = async () => {
    if (!newStatus) {
      toast({
        title: "Status required",
        description: "Please select a status before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Grievance updated",
      description: `Status changed to ${newStatus}${correctedCategory ? ` and category corrected to ${correctedCategory}` : ''}.`,
    });

    setIsSaving(false);
    setSelectedGrievance(null);
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Building2 className="h-4 w-4" />
            <span>{department?.name || 'IT Services'}</span>
          </div>
          <h1 className="text-3xl font-bold">Department Grievances</h1>
          <p className="text-muted-foreground mt-1">
            Review and update grievances assigned to your department
          </p>
        </div>

        {/* Filters */}
        <Card variant="flat" className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="whitespace-nowrap"
                  >
                    {status}
                  </Button>
                ))}
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
                    <th className="text-left p-4 font-medium text-sm">Student</th>
                    <th className="text-left p-4 font-medium text-sm">Description</th>
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
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{grievance.studentName}</span>
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="text-sm truncate">{grievance.grievanceText}</p>
                      </td>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenGrievance(grievance)}
                        >
                          Update
                        </Button>
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

        {/* Update Dialog */}
        <Dialog open={!!selectedGrievance} onOpenChange={() => setSelectedGrievance(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Update Grievance</DialogTitle>
            </DialogHeader>
            
            {selectedGrievance && (
              <div className="space-y-6">
                {/* Grievance Summary */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedGrievance.studentName}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {format(selectedGrievance.createdAt, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{selectedGrievance.grievanceText}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{selectedGrievance.predictedCategory}</Badge>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round(selectedGrievance.confidenceScore * 100)}% confident)
                    </span>
                  </div>
                </div>

                {/* Update Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Update Status</Label>
                    <Select 
                      value={newStatus} 
                      onValueChange={(v) => setNewStatus(v as GrievanceStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Resolution Remarks</Label>
                    <Textarea
                      placeholder="Add remarks about the status update..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Correct AI Category (Optional)</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      If the AI misclassified this grievance, select the correct category. 
                      This helps improve our classification accuracy.
                    </p>
                    <Select 
                      value={correctedCategory} 
                      onValueChange={(v) => setCorrectedCategory(v as GrievanceCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct category (if different)" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedGrievance(null)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
