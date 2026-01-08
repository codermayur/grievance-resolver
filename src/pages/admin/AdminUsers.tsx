import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { departments } from '@/services/mockData';
import { User, UserRole } from '@/types';
import { 
  Search, 
  Plus, 
  Edit2, 
  Users,
  GraduationCap,
  ClipboardList,
  Settings,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Mock users for admin view
const mockAdminUsers: User[] = [
  { id: '1', name: 'John Student', email: 'john@university.edu', role: 'student', isActive: true, createdAt: new Date('2024-01-01') },
  { id: '2', name: 'Jane Doe', email: 'jane@university.edu', role: 'student', isActive: true, createdAt: new Date('2024-01-05') },
  { id: '3', name: 'Dr. Smith', email: 'smith@university.edu', role: 'faculty', departmentId: 'dept-1', isActive: true, createdAt: new Date('2023-08-15') },
  { id: '4', name: 'Prof. Johnson', email: 'johnson@university.edu', role: 'faculty', departmentId: 'dept-2', isActive: true, createdAt: new Date('2023-09-01') },
  { id: '5', name: 'Admin User', email: 'admin@university.edu', role: 'admin', isActive: true, createdAt: new Date('2023-01-01') },
];

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockAdminUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student' as UserRole,
    departmentId: '',
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId || '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'student',
        departmentId: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.role === 'faculty' && !formData.departmentId) {
      toast({
        title: "Department required",
        description: "Please select a department for faculty members.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData, departmentId: formData.role === 'faculty' ? formData.departmentId : undefined }
          : u
      ));
      toast({
        title: "User updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        departmentId: formData.role === 'faculty' ? formData.departmentId : undefined,
        isActive: true,
        createdAt: new Date(),
      };
      setUsers([...users, newUser]);
      toast({
        title: "User created",
        description: `${formData.name} has been added successfully.`,
      });
    }

    setIsSaving(false);
    setIsDialogOpen(false);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'faculty':
        return <ClipboardList className="h-4 w-4" />;
      case 'admin':
        return <Settings className="h-4 w-4" />;
    }
  };

  const getRoleVariant = (role: UserRole) => {
    switch (role) {
      case 'student': return 'student';
      case 'faculty': return 'faculty';
      case 'admin': return 'admin';
    }
  };

  const getDepartmentName = (deptId?: string) => {
    if (!deptId) return '-';
    return departments.find(d => d.id === deptId)?.name || '-';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage students, faculty, and administrators
            </p>
          </div>
          <Button variant="hero" onClick={() => handleOpenDialog()}>
            <Plus className="h-5 w-5" />
            Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-role-student/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-role-student" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'student').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-role-faculty/10 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-role-faculty" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'faculty').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Faculty</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-role-admin/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-role-admin" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card variant="flat" className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as UserRole | 'all')}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card variant="elevated">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium text-sm">Name</th>
                    <th className="text-left p-4 font-medium text-sm">Email</th>
                    <th className="text-left p-4 font-medium text-sm">Role</th>
                    <th className="text-left p-4 font-medium text-sm">Department</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-sm">Joined</th>
                    <th className="text-left p-4 font-medium text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="p-4">
                        <Badge variant={getRoleVariant(user.role) as any} className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{getDepartmentName(user.departmentId)}</td>
                      <td className="p-4">
                        <Badge variant={user.isActive ? 'resolved' : 'escalated'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {format(user.createdAt, 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit User Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@university.edu"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'faculty' && (
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select 
                    value={formData.departmentId} 
                    onValueChange={(v) => setFormData({ ...formData, departmentId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingUser ? 'Save Changes' : 'Add User'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
