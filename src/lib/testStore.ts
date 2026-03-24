import { MBTIType, TestResult } from '@/types';
import { dimensionMapping } from './questions';

// 记录每个问题的得分 (1-5)
export type AnswerRecord = Record<number, number>;

export function calculateScores(answers: AnswerRecord): TestResult['scores'] {
  const scores = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  Object.entries(answers).forEach(([questionId, score]) => {
    const qId = parseInt(questionId);
    
    const dimensionKey = getQuestionDimension(qId);
    if (!dimensionKey) return;

    const mapping = dimensionMapping[dimensionKey];
    if (!mapping) return;

    // 根据 direction 决定分数分配
    // direction: 'first' 表示题目倾向第一个字母（如 E），5 分给 E，1 分给 I
    // direction: 'second' 表示题目倾向第二个字母（如 I），5 分给 I，1 分给 E
    const direction = getQuestionDirection(qId);
    
    if (direction === 'first') {
      // 题目倾向第一个字母，得分给第一个，反向得分给第二个
      const firstLetter = mapping.first as keyof typeof scores;
      const secondLetter = mapping.second as keyof typeof scores;
      
      // 用户选 5 分（十分符合）-> first 得 5 分，second 得 1 分
      // 用户选 1 分（十分不符合）-> first 得 1 分，second 得 5 分
      scores[firstLetter] += score;
      scores[secondLetter] += (6 - score);
    } else {
      // 题目倾向第二个字母，得分给第二个，反向得分给第一个
      const firstLetter = mapping.first as keyof typeof scores;
      const secondLetter = mapping.second as keyof typeof scores;
      
      // 用户选 5 分（十分符合）-> second 得 5 分，first 得 1 分
      // 用户选 1 分（十分不符合）-> second 得 1 分，first 得 5 分
      scores[secondLetter] += score;
      scores[firstLetter] += (6 - score);
    }
  });

  return scores;
}

function getQuestionDimension(questionId: number): 'EI' | 'SN' | 'TF' | 'JP' | null {
  if (questionId >= 1 && questionId <= 10) return 'EI';
  if (questionId >= 11 && questionId <= 20) return 'SN';
  if (questionId >= 21 && questionId <= 30) return 'TF';
  if (questionId >= 31 && questionId <= 40) return 'JP';
  return null;
}

function getQuestionDirection(questionId: number): 'first' | 'second' {
  // 根据 questions.ts 中的 direction 定义
  const directions: Record<number, 'first' | 'second'> = {
    // EI 维度
    1: 'first', 2: 'first', 3: 'second', 4: 'first', 5: 'first',
    6: 'first', 7: 'first', 8: 'first', 9: 'first', 10: 'second',
    // SN 维度
    11: 'first', 12: 'first', 13: 'second', 14: 'first', 15: 'second',
    16: 'first', 17: 'second', 18: 'first', 19: 'second', 20: 'second',
    // TF 维度
    21: 'first', 22: 'first', 23: 'second', 24: 'first', 25: 'second',
    26: 'first', 27: 'second', 28: 'first', 29: 'second', 30: 'first',
    // JP 维度
    31: 'first', 32: 'first', 33: 'first', 34: 'first', 35: 'second',
    36: 'first', 37: 'second', 38: 'first', 39: 'second', 40: 'first',
  };
  return directions[questionId] || 'first';
}

export function determineMBTIType(scores: TestResult['scores']): MBTIType {
  const eOrI = scores.E >= scores.I ? 'E' : 'I';
  const sOrN = scores.S >= scores.N ? 'S' : 'N';
  const tOrF = scores.T >= scores.F ? 'T' : 'F';
  const jOrP = scores.J >= scores.P ? 'J' : 'P';

  const type = `${eOrI}${sOrN}${tOrF}${jOrP}` as MBTIType;
  return type;
}

export function calculateResult(answers: AnswerRecord): TestResult {
  const scores = calculateScores(answers);
  const type = determineMBTIType(scores);

  return { type, scores };
}
