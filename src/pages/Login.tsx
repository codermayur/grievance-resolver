import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        // Redirect based on role
        if (email.includes('admin')) {
          navigate('/admin');
        } else if (email.includes('faculty')) {
          navigate('/faculty');
        } else {
          navigate('/student');
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Student', email: 'student@university.edu', password: 'password' },
    { role: 'Faculty', email: 'faculty@university.edu', password: 'password' },
    { role: 'Admin', email: 'admin@university.edu', password: 'password' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">GrievEase</h1>
              <p className="text-sm text-white/80">Resolution System</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            AI-Powered Student<br />Grievance Resolution
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            Submit grievances in natural language and let our AI automatically classify, 
            route, and track resolutions across departments.
          </p>
          
          <div className="flex gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex-1">
              <p className="text-3xl font-bold text-white">95%</p>
              <p className="text-sm text-white/70">Classification Accuracy</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex-1">
              <p className="text-3xl font-bold text-white">48h</p>
              <p className="text-sm text-white/70">Avg. Resolution Time</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex-1">
              <p className="text-3xl font-bold text-white">8</p>
              <p className="text-sm text-white/70">Departments</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/60">
          © 2024 University Grievance System. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">GrievEase</h1>
              <p className="text-sm text-muted-foreground">Resolution System</p>
            </div>
          </div>

          <Card variant="elevated" className="animate-slide-up">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Register
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card variant="flat" className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">Demo Credentials</p>
              <div className="space-y-2">
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.role}
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-background hover:bg-accent transition-colors text-sm"
                  >
                    <span className="font-medium">{cred.role}:</span>{' '}
                    <span className="text-muted-foreground">{cred.email}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
