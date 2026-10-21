export interface CurriculumUpdateSource {
  title: string;
  url: string;
  publishedDate?: string;
  fetchedAt: string;
}

export interface CurriculumLessonExample {
  code: string;
  explanation: string;
}

export interface CurriculumUpdateLesson {
  title: string;
  explanation: string;
  examples: [CurriculumLessonExample, CurriculumLessonExample];
}

export interface CurriculumUpdateQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface CurriculumUpdateContent {
  meaning: string;
  prerequisites: string[];
  basics: string[];
  lessons: CurriculumUpdateLesson[];
  assessment: CurriculumUpdateQuestion[];
  advanced: string[];
  extras: string[];
  onlineExamples: Array<{
    title: string;
    summary: string;
    url: string;
  }>;
}

export interface CurriculumProposal {
  id: string;
  courseId: string;
  courseName: string;
  sourceUrl: string;
  sourceTitle: string;
  sourcePublishedDate?: string;
  fetchedAt: string;
  status: 'pending' | 'published' | 'rejected';
  detectedAt: string;
  stageId?: number;
  title?: string;
  summary?: string;
  content?: CurriculumUpdateContent;
}

export interface PublishedCurriculumUpdate extends CurriculumProposal {
  status: 'published';
  stageId: number;
  title: string;
  summary: string;
  content: CurriculumUpdateContent;
  publishedAt: string;
}
