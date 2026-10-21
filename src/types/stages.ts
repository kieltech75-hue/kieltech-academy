export type StageLevel = 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced' | 'Mastery' | 'Specialization';

export interface CodeSnippet {
  title: string;
  description: string;
  code: string;
  expectedOutput?: string;
  explanation: string;
}

export interface QuizOption {
  text: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  code?: string;
  options: QuizOption[];
  correctIndex: number;
}

export interface ChallengeTestCase {
  input: string;
  expected: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testCases: ChallengeTestCase[];
}

export interface ProjectBlueprint {
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  description: string;
  architecture: string[];
  skillsLearned: string[];
  starterCode: string;
}

export interface TopicGotcha {
  title: string;
  badCode: string;
  goodCode: string;
  explanation: string;
}

export interface StageTopic {
  id: string;
  title: string;
  summary: string;
  concepts: string[];
  codeSnippets: CodeSnippet[];
  gotcha?: TopicGotcha;
}

export interface Stage {
  id: number;
  stageNumber: string; // e.g. "01"
  title: string;
  tagline: string;
  level: StageLevel;
  durationHours: string;
  prerequisites: string[];
  summary: string;
  mentalModel: string;
  topics: StageTopic[];
  quizzes: QuizQuestion[];
  challenge: CodingChallenge;
  project: ProjectBlueprint;
}

export interface SpecializationTrack {
  id: string;
  title: string;
  role: string;
  description: string;
  coreLibraries: string[];
  typicalTasks: string[];
  roadmapStages: string[];
  exampleCode: string;
  salaryRange: string;
}
