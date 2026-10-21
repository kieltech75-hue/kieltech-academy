export type AcademicActivityType =
  | 'sign-in'
  | 'account-created'
  | 'sign-out'
  | 'course-selected'
  | 'stage-viewed'
  | 'stage-test-started'
  | 'degree-defense-started'
  | 'assessment-submitted'
  | 'lesson-bookmarked'
  | 'lesson-unbookmarked';

export interface AcademicActivityEvent {
  id: string;
  actorUid: string;
  type: AcademicActivityType;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  courseId?: string;
  courseName?: string;
  stageId?: number;
  assessmentType?: 'stage_test' | 'graduation_exam';
  score?: number;
  totalQuestions?: number;
  percentage?: number;
  passed?: boolean;
  lessonTitle?: string;
}
