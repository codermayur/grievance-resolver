import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Loader2, 
  Sparkles, 
  CheckCircle2,
  Building2,
  AlertCircle
} from 'lucide-react';
import { classifyGrievance, determinePriority } from '@/services/aiService';
import { categoryToDepartment, departments } from '@/services/mockData';
import { AIClassificationResponse, GrievanceCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface SubmitGrievanceFormProps {
  onSubmit: (grievanceText: string, category: GrievanceCategory, departmentId: string, priority: string, confidence: number) => void;
}

export function SubmitGrievanceForm({ onSubmit }: SubmitGrievanceFormProps) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classification, setClassification] = useState<AIClassificationResponse | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (text.trim().length < 20) {
      toast({
        title: "Text too short",
        description: "Please provide more details about your grievance (at least 20 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await classifyGrievance(text);
      const determinedPriority = determinePriority(text, result.category);
      setClassification(result);
      setPriority(determinedPriority);
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not analyze your grievance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!classification || !priority) return;

    setIsSubmitting(true);
    try {
      const departmentId = categoryToDepartment[classification.category];
      onSubmit(text, classification.category, departmentId, priority, classification.confidence);
      
      toast({
        title: "Grievance submitted successfully!",
        description: "You will be notified when there are updates.",
      });

      // Reset form
      setText('');
      setClassification(null);
      setPriority(null);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Could not submit your grievance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDepartmentName = () => {
    if (!classification) return '';
    const deptId = categoryToDepartment[classification.category];
    return departments.find(d => d.id === deptId)?.name || '';
  };

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Submit a Grievance
        </CardTitle>
        <CardDescription>
          Describe your issue in detail. Our AI will automatically categorize and route it to the appropriate department.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Textarea
            placeholder="Describe your grievance in detail. For example: 'The WiFi connection in the library has been very slow for the past week, making it difficult to complete my research work.'"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setClassification(null);
              setPriority(null);
            }}
            className="min-h-[150px] resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {text.length} characters
          </p>
        </div>

        {/* AI Classification Results */}
        {classification && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI Classification Results</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <Badge variant="default" className="mt-1">
                    {classification.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{getDepartmentName()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="text-sm font-medium">{Math.round(classification.confidence * 100)}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge 
                    variant={priority === 'High' ? 'high' : priority === 'Medium' ? 'medium' : 'low'} 
                    className="mt-1"
                  >
                    {priority}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!classification ? (
            <Button
              variant="gradient"
              className="flex-1"
              onClick={handleAnalyze}
              disabled={isAnalyzing || text.trim().length < 20}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze with AI
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setClassification(null);
                  setPriority(null);
                }}
              >
                Re-analyze
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Grievance
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
