import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GrievanceCard } from '@/components/grievance/GrievanceCard';
import { GrievanceDetail } from '@/components/grievance/GrievanceDetail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { getGrievancesByStudentId, getStatusLogsByGrievanceId, mockGrievances } from '@/services/mockData';
import { Grievance, GrievanceStatus } from '@/types';
import { Search, Plus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentGrievances() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GrievanceStatus | 'All'>('All');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  const grievances = user ? getGrievancesByStudentId(user.id) : mockGrievances.slice(0, 2);

  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = g.grievanceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.predictedCategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses: (GrievanceStatus | 'All')[] = ['All', 'Pending', 'In Progress', 'Resolved', 'Escalated'];

  const getStatusLogs = (grievanceId: string) => {
    return getStatusLogsByGrievanceId(grievanceId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Grievances</h1>
            <p className="text-muted-foreground mt-1">Track and manage your submitted grievances</p>
          </div>
          <Link to="/student/submit">
            <Button variant="hero">
              <Plus className="h-5 w-5" />
              New Grievance
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card variant="flat" className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search grievances..."
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

        {/* Grievances List */}
        {filteredGrievances.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredGrievances.map((grievance) => (
              <GrievanceCard
                key={grievance.id}
                grievance={grievance}
                onClick={() => setSelectedGrievance(grievance)}
              />
            ))}
          </div>
        ) : (
          <Card variant="flat" className="bg-muted/30">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'All'
                  ? 'No grievances match your filters'
                  : 'You haven\'t submitted any grievances yet'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Grievance Detail Dialog */}
        <Dialog open={!!selectedGrievance} onOpenChange={() => setSelectedGrievance(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Grievance #{selectedGrievance?.id}</DialogTitle>
            </DialogHeader>
            {selectedGrievance && (
              <GrievanceDetail
                grievance={selectedGrievance}
                statusLogs={getStatusLogs(selectedGrievance.id)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
