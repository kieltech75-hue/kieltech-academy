export type DomainTrack = 'backend' | 'frontend';

export interface FacultyProfile {
  department: string;
  chair: string;
  dean: string;
  courseCode: string;
  credits: number;
  accreditationBody: string;
  academicCalendar: string;
}

export interface StudentProfile {
  studentId: string;
  fullName: string;
  matriculationYear: number;
  academicStanding: 'Good Standing' | 'Dean\'s List' | 'Honor Roll' | 'Academic Probation';
  gpa: number;
}

export interface LanguageCourse {
  id: string;
  name: string;
  category: DomainTrack;
  courseCode: string; // e.g. CS-301
  department: string;
  credits: number;
  prerequisites: string[];
  syllabusId: string;
  iconName: string;
  badge: string;
  color: string;
  accentBg: string;
  description: string;
  learningOutcomes: string[];
  totalStages: number;
}

export interface QuestionOption {
  text: string;
  explanation: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  topicTag: string; // The specific syllabus topic category this question tests
  courseModuleRef?: string; // Reference to module ID for direct remediation
  codeSnippet?: string;
  options?: QuestionOption[]; // Optional for pure coding questions
  correctIndex?: number; // Optional for pure coding questions
  type: 'multiple_choice' | 'coding';
  starterCode?: string;
  expectedOutput?: string;
  testCases?: {
    input?: string;
    description: string;
    validationCheck: (code: string, logs: string[]) => boolean;
  }[];
  hint?: string;
}

export interface StageCurriculumItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  keyTopics: string[];
  readingMaterials?: {
    title: string;
    author: string;
    academicCitation: string;
  }[];
  labObjectives?: string[];
}

export interface CourseStage {
  id: number;
  stageNumber: string;
  courseCode?: string; // e.g., CS-301.1
  title: string;
  tagline: string;
  level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced' | 'Mastery';
  durationHours: string;
  creditHours?: number;
  summary: string;
  coreConcepts: string[];
  codeExamples: {
    title: string;
    description: string;
    code: string;
    output?: string;
    explanation: string;
  }[];
  gotchas: {
    title: string;
    badCode: string;
    goodCode: string;
    explanation: string;
  }[];
  midStageTest: {
    testTitle: string;
    instructions: string;
    questions: ExamQuestion[];
  };
  learningModules?: StageCurriculumItem[];
}

export interface TestResultRecord {
  id: string;
  courseId: string;
  courseName: string;
  courseCode?: string;
  stageId?: number;
  stageTitle?: string;
  type: 'stage_test' | 'graduation_exam';
  score: number;
  totalQuestions: number;
  percentage: number;
  letterGrade?: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F';
  gpaScore?: number;
  passed: boolean;
  timestamp: number;
  verificationHash?: string;
  missedTopics?: string[]; // Specific topics missed during exam
  userAnswers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    codeAnswer?: string;
    executionFeedback?: string;
  }[];
}

export interface GraduationExam {
  title: string;
  courseName: string;
  courseCode: string;
  instructions: string;
  passingScore: number;
  questions: ExamQuestion[];
}

export interface CertificateData {
  certificateId: string;
  studentName: string;
  studentId: string;
  courseName: string;
  courseCode: string;
  completionDate: string;
  honorsStanding: string;
  finalGrade: string;
  gpa: number;
  institution: string;
  chancellor: string;
  dean: string;
  verificationCode: string;
}

export interface BookmarkedLesson {
  id: string; // e.g. "py-s1-mod1" or "lab-0"
  type: 'curriculum_module' | 'lab_example';
  courseId: string;
  courseName: string;
  stageId: number;
  stageTitle: string;
  title: string;
  category?: string;
  description: string;
  codeSnippet?: string;
  savedAt: number;
}
