import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Building2, 
  BarChart3, 
  Settings,
  LogOut,
  GraduationCap,
  ClipboardList,
  Plus
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavItems = (): NavItem[] => {
    switch (user?.role) {
      case 'student':
        return [
          { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
          { label: 'Submit Grievance', href: '/student/submit', icon: Plus },
          { label: 'My Grievances', href: '/student/grievances', icon: FileText },
        ];
      case 'faculty':
        return [
          { label: 'Dashboard', href: '/faculty', icon: LayoutDashboard },
          { label: 'Grievances', href: '/faculty/grievances', icon: ClipboardList },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
          { label: 'All Grievances', href: '/admin/grievances', icon: FileText },
          { label: 'Users', href: '/admin/users', icon: Users },
          { label: 'Departments', href: '/admin/departments', icon: Building2 },
          { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'student':
        return <GraduationCap className="h-5 w-5" />;
      case 'faculty':
        return <ClipboardList className="h-5 w-5" />;
      case 'admin':
        return <Settings className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'student':
        return 'text-role-student';
      case 'faculty':
        return 'text-role-faculty';
      case 'admin':
        return 'text-role-admin';
      default:
        return 'text-primary';
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">GrievEase</h1>
            <p className="text-xs text-muted-foreground">Resolution System</p>
          </div>
        </div>

        {/* User Info */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-background", getRoleColor())}>
              {getRoleIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
