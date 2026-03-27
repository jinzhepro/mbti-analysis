import { TestQuestion } from '@/types';

// 简化版测试题目 - 每个维度 3 题，共 12 题
// 精选自完整版题目，保留最具区分度的问题
export const quickQuestions: TestQuestion[] = [
  // E-I 维度（3 题）
  {
    id: 1,
    question: '公司年会上，你主动走向陌生人聚集的圈子，开始自我介绍并加入谈话',
    dimension: 'EI',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 2,
    question: '周末独自在家一整天，你感到放松和满足，不需要外出见人',
    dimension: 'EI',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 3,
    question: '遇到烦心事时，你更愿意找朋友倾诉而不是独自思考',
    dimension: 'EI',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },

  // S-N 维度（3 题）
  {
    id: 4,
    question: '学习新技能时，你更关注具体的操作步骤而不是背后的理论原理',
    dimension: 'SN',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 5,
    question: '做计划时，你经常考虑各种可能性和潜在的变化',
    dimension: 'SN',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 6,
    question: '你相信"眼见为实"，对没有实际证据的说法持怀疑态度',
    dimension: 'SN',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },

  // T-F 维度（3 题）
  {
    id: 7,
    question: '朋友向你倾诉感情问题时，你会先分析问题，给出建议',
    dimension: 'TF',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 8,
    question: '看到别人哭泣时，你会不由自主地感到难过和心疼',
    dimension: 'TF',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 9,
    question: '在争论中，即使对方是好朋友，你也会坚持自己认为正确的观点',
    dimension: 'TF',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },

  // J-P 维度（3 题）
  {
    id: 10,
    question: '旅行前，你会提前做好详细的行程规划和预订',
    dimension: 'JP',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 11,
    question: '你经常同时做多件事情，在它们之间来回切换',
    dimension: 'JP',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 12,
    question: '临时改变计划会让你感到不安或烦躁',
    dimension: 'JP',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
];

// 快速测试的维度题目数量
export const QUICK_TEST_QUESTION_COUNT = 12;

// 快速测试说明
export const QUICK_TEST_DESCRIPTION = {
  title: '快速复核测试',
  subtitle: '12 题快速版 · 约 3 分钟',
  description: '适合已做过完整版测试，想要快速复核人格类型的用户。题目精选自完整版，保留最具区分度的问题。',
  note: '注意：快速测试结果仅供参考，完整版测试（40 题）结果更准确。',
};
