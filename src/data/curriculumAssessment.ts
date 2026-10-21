import { CourseStage, ExamQuestion } from '../types/curriculum';

interface AssessmentSource {
  stageId: number;
  stageTitle: string;
  topic: string;
  kind: 'concept' | 'example' | 'output' | 'gotcha' | 'fix' | 'summary' | 'module';
  answer: string;
}

const questionCountByAssessment = {
  stage: 30,
  graduation: 60,
};

function cleanText(value: string, maxLength = 280): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1).trimEnd()}…` : normalized;
}

function createAssessmentSources(stages: CourseStage[]): AssessmentSource[] {
  const sources: AssessmentSource[] = [];

  for (const stage of stages) {
    for (const concept of stage.coreConcepts) {
      sources.push({
        stageId: stage.id,
        stageTitle: stage.title,
        topic: cleanText(concept, 72),
        kind: 'concept',
        answer: cleanText(concept),
      });
    }

    for (const example of stage.codeExamples) {
      sources.push({
        stageId: stage.id,
        stageTitle: stage.title,
        topic: cleanText(example.title, 72),
        kind: 'example',
        answer: cleanText(example.explanation),
      });

      if (example.output?.trim()) {
        sources.push({
          stageId: stage.id,
          stageTitle: stage.title,
          topic: cleanText(example.title, 72),
          kind: 'output',
          answer: `The lesson example shows: ${cleanText(example.output, 220)}`,
        });
      }
    }

    for (const gotcha of stage.gotchas) {
      sources.push({
        stageId: stage.id,
        stageTitle: stage.title,
        topic: cleanText(gotcha.title, 72),
        kind: 'gotcha',
        answer: cleanText(gotcha.explanation),
      });

      if (gotcha.goodCode.trim()) {
        sources.push({
          stageId: stage.id,
          stageTitle: stage.title,
          topic: cleanText(gotcha.title, 72),
          kind: 'fix',
          answer: `The lesson recommends: ${cleanText(gotcha.goodCode, 220)}`,
        });
      }
    }

    if (stage.summary.trim()) {
      sources.push({
        stageId: stage.id,
        stageTitle: stage.title,
        topic: cleanText(stage.title, 72),
        kind: 'summary',
        answer: cleanText(stage.summary),
      });
    }

    for (const module of stage.learningModules ?? []) {
      for (const topic of module.keyTopics) {
        sources.push({
          stageId: stage.id,
          stageTitle: stage.title,
          topic: cleanText(topic, 72),
          kind: 'module',
          answer: cleanText(topic),
        });
      }
    }
  }

  return sources.filter((source) => source.topic && source.answer);
}

function createQuestionPrompt(source: AssessmentSource, variant: number): string {
  switch (source.kind) {
    case 'concept':
      return `Which statement correctly describes “${source.topic}” in ${source.stageTitle}?`;
    case 'example':
      return `In the “${source.topic}” lesson example, what principle is being demonstrated?`;
    case 'output':
      return `According to the “${source.topic}” lesson example, what output is shown?`;
    case 'gotcha':
      return `Why does the lesson warn against “${source.topic}”?`;
    case 'fix':
      return `What safer approach does the lesson recommend for “${source.topic}”?`;
    case 'summary':
      return variant % 2 === 0
        ? `What is the main learning goal of ${source.stageTitle}?`
        : `Which description best summarizes ${source.stageTitle}?`;
    case 'module':
      return `Which topic is explicitly taught in ${source.stageTitle}?`;
  }
}

export function generateCurriculumQuestions(
  courseId: string,
  stages: CourseStage[],
  count: number
): ExamQuestion[] {
  const sourcesByStage = stages.map((stage) => createAssessmentSources([stage]));
  const sources = sourcesByStage.flat();
  const stageIds = stages.map((stage) => stage.id).join(', ');
  const uniqueAnswers = new Set(sources.map((source) => source.answer));

  if (sourcesByStage.some((stageSources) => stageSources.length === 0) || uniqueAnswers.size < 4) {
    throw new Error(`Cannot build a curriculum assessment for ${courseId} (stages: ${stageIds}): every stage must have taught material and at least four distinct answers are required.`);
  }

  return Array.from({ length: count }, (_, index) => {
    const stageSources = sourcesByStage[index % sourcesByStage.length];
    const source = stageSources[Math.floor(index / sourcesByStage.length) % stageSources.length];
    const distractors: AssessmentSource[] = [];
    const usedAnswers = new Set([source.answer]);
    const start = (index * 7 + source.stageId) % sources.length;

    for (let offset = 0; offset < sources.length && distractors.length < 3; offset += 1) {
      const candidate = sources[(start + offset) % sources.length];
      if (!usedAnswers.has(candidate.answer)) {
        usedAnswers.add(candidate.answer);
        distractors.push(candidate);
      }
    }

    if (distractors.length < 3) {
      throw new Error(`Cannot create four distinct answer options for ${courseId} assessment question ${index + 1}.`);
    }

    const correctIndex = (index * 3 + source.stageId) % 4;
    const options = distractors.map((item) => ({
      text: item.answer,
      explanation: `This describes “${item.topic}” in ${item.stageTitle}, not the topic asked about.`,
    }));
    options.splice(correctIndex, 0, {
      text: source.answer,
      explanation: `This answer is taught in ${source.stageTitle} under “${source.topic}”.`,
    });

    return {
      id: `${courseId}-curriculum-q${index + 1}`,
      type: 'multiple_choice',
      topicTag: `Stage ${String(source.stageId).padStart(2, '0')}: ${source.topic}`,
      question: createQuestionPrompt(source, index),
      options,
      correctIndex,
    };
  });
}

export function generateStageAssessment(courseId: string, stage: CourseStage): ExamQuestion[] {
  return generateCurriculumQuestions(courseId, [stage], questionCountByAssessment.stage);
}

export function generateGraduationAssessment(courseId: string, stages: CourseStage[]): ExamQuestion[] {
  return generateCurriculumQuestions(courseId, stages, questionCountByAssessment.graduation);
}
