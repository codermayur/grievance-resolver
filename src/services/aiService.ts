import { AIClassificationResponse, GrievanceCategory } from '@/types';

// Keywords mapping for mock AI classification
const categoryKeywords: Record<GrievanceCategory, string[]> = {
  'IT': ['wifi', 'internet', 'computer', 'laptop', 'software', 'network', 'email', 'login', 'password', 'server', 'printer', 'technical'],
  'Academic': ['exam', 'grade', 'marks', 'professor', 'lecture', 'course', 'assignment', 'attendance', 'curriculum', 'syllabus', 'class', 'teacher'],
  'Infrastructure': ['building', 'classroom', 'projector', 'chair', 'desk', 'fan', 'light', 'electricity', 'water', 'toilet', 'elevator', 'parking'],
  'Hostel': ['hostel', 'room', 'ac', 'air conditioning', 'bed', 'mattress', 'roommate', 'warden', 'mess', 'food', 'laundry', 'accommodation'],
  'Library': ['library', 'book', 'borrow', 'fine', 'journal', 'research paper', 'study room', 'reading', 'librarian'],
  'Transport': ['bus', 'transport', 'route', 'timing', 'schedule', 'driver', 'vehicle', 'shuttle', 'pickup', 'drop'],
  'Finance': ['fee', 'scholarship', 'payment', 'refund', 'amount', 'bank', 'transaction', 'finance', 'money', 'dues', 'receipt'],
  'Administration': ['certificate', 'document', 'office', 'registration', 'id card', 'admission', 'form', 'application', 'verification'],
  'Other': [],
};

export async function classifyGrievance(text: string): Promise<AIClassificationResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerText = text.toLowerCase();
  const scores: Record<GrievanceCategory, number> = {
    'IT': 0,
    'Academic': 0,
    'Infrastructure': 0,
    'Hostel': 0,
    'Library': 0,
    'Transport': 0,
    'Finance': 0,
    'Administration': 0,
    'Other': 0,
  };

  // Calculate scores based on keyword matches
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        scores[category as GrievanceCategory] += 1;
      }
    }
  }

  // Find the category with the highest score
  let maxCategory: GrievanceCategory = 'Other';
  let maxScore = 0;

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category as GrievanceCategory;
    }
  }

  // Calculate confidence based on score and text length
  const totalKeywordMatches = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalKeywordMatches > 0 
    ? Math.min(0.95, 0.6 + (maxScore / totalKeywordMatches) * 0.35)
    : 0.5;

  return {
    category: maxCategory,
    confidence: Math.round(confidence * 100) / 100,
  };
}

export function determinePriority(text: string, category: GrievanceCategory): 'Low' | 'Medium' | 'High' {
  const lowerText = text.toLowerCase();
  
  // High priority keywords
  const urgentKeywords = ['urgent', 'emergency', 'immediately', 'critical', 'broken', 'not working', 'failed', 'cannot access'];
  
  // Medium priority keywords
  const mediumKeywords = ['issue', 'problem', 'slow', 'delayed', 'inconvenient', 'difficulty'];

  for (const keyword of urgentKeywords) {
    if (lowerText.includes(keyword)) {
      return 'High';
    }
  }

  for (const keyword of mediumKeywords) {
    if (lowerText.includes(keyword)) {
      return 'Medium';
    }
  }

  // Some categories are inherently higher priority
  if (category === 'Finance' || category === 'Academic') {
    return 'Medium';
  }

  return 'Low';
}
