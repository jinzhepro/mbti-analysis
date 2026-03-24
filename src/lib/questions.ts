import { TestQuestion } from '@/types';

export const testQuestions: TestQuestion[] = [
  // E-I 维度题目 - 实际场景
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
    question: '连续参加三小时的社交活动后，你感到精力充沛，还想继续聚会',
    dimension: 'EI',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 3,
    question: '周末独自在家一整天，你感到放松和满足，不需要外出见人',
    dimension: 'EI',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 4,
    question: '在新环境中（如新学校、新公司），你会主动认识周围的人',
    dimension: 'EI',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 5,
    question: '朋友聚会时，你通常是那个组织活动、联系大家的人',
    dimension: 'EI',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 6,
    question: '遇到烦心事时，你更愿意找朋友倾诉而不是独自思考',
    dimension: 'EI',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 7,
    question: '在会议上被要求发言时，你会即兴发挥，边说边思考',
    dimension: 'EI',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 8,
    question: '你有很多朋友，但深交的朋友不多',
    dimension: 'EI',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 9,
    question: '长假期间，你会安排密集的社交活动，几乎每天都有聚会',
    dimension: 'EI',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 10,
    question: '在人群中，你倾向于坐在角落或不显眼的位置',
    dimension: 'EI',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },

  // S-N 维度题目 - 实际场景
  {
    id: 11,
    question: '学习新技能时，你更关注具体的操作步骤而不是背后的理论原理',
    dimension: 'SN',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 12,
    question: '听别人讲述经历时，你会注意到很多细节（如时间、地点、具体对话）',
    dimension: 'SN',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 13,
    question: '做计划时，你经常考虑各种可能性和潜在的变化',
    dimension: 'SN',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 14,
    question: '阅读小说时，你更关注故事情节和人物命运，而不是作者的写作手法',
    dimension: 'SN',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 15,
    question: '讨论问题时，你经常提出新颖的想法和独特的视角',
    dimension: 'SN',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 16,
    question: '你相信"眼见为实"，对没有实际证据的说法持怀疑态度',
    dimension: 'SN',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 17,
    question: '做决定时，你经常凭直觉和灵感，而不是详细分析',
    dimension: 'SN',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 18,
    question: '你更喜欢按部就班地完成任务，而不是跳跃式地工作',
    dimension: 'SN',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 19,
    question: '聊天时，你经常从一个话题跳跃到另一个看似不相关的话题',
    dimension: 'SN',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 20,
    question: '你善于发现事物之间的规律和联系',
    dimension: 'SN',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },

  // T-F 维度题目 - 实际场景
  {
    id: 21,
    question: '朋友向你倾诉感情问题时，你会先分析问题，给出建议',
    dimension: 'TF',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 22,
    question: '做重要决定时，你会列出利弊清单，理性分析后选择',
    dimension: 'TF',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 23,
    question: '看到别人哭泣时，你会不由自主地感到难过和心疼',
    dimension: 'TF',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 24,
    question: '在争论中，即使对方是好朋友，你也会坚持自己认为正确的观点',
    dimension: 'TF',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 25,
    question: '选择礼物时，你会仔细考虑对方的喜好和感受',
    dimension: 'TF',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 26,
    question: '工作中，你更看重任务的完成质量而不是团队氛围',
    dimension: 'TF',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 27,
    question: '你很难对别人的请求说"不"，即使自己很忙',
    dimension: 'TF',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 28,
    question: '评价一部电影时，你更关注剧情逻辑是否合理',
    dimension: 'TF',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 29,
    question: '做决定时，你经常考虑这个决定会对周围的人产生什么影响',
    dimension: 'TF',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 30,
    question: '你相信"对事不对人"，批评时只针对事情本身',
    dimension: 'TF',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },

  // J-P 维度题目 - 实际场景
  {
    id: 31,
    question: '旅行前，你会提前做好详细的行程规划和预订',
    dimension: 'JP',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 32,
    question: '你的书桌或工作区域通常保持整洁有序',
    dimension: 'JP',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 33,
    question: '即使没有截止日期，你也会提前完成任务',
    dimension: 'JP',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 34,
    question: '临时改变计划会让你感到不安或烦躁',
    dimension: 'JP',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 35,
    question: '你经常同时做多件事情，在它们之间来回切换',
    dimension: 'JP',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 36,
    question: '购物时，你会货比三家，仔细比较后再决定',
    dimension: 'JP',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 37,
    question: '你经常拖延到最后一刻才开始做重要的事情',
    dimension: 'JP',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 38,
    question: '你喜欢把事情列成清单，完成后逐一勾选',
    dimension: 'JP',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 39,
    question: '周末你更喜欢随性安排，而不是提前计划',
    dimension: 'JP',
    direction: 'second',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
  {
    id: 40,
    question: '做决定后，你很少后悔或反复思考是否应该选另一个',
    dimension: 'JP',
    direction: 'first',
    firstOption: '十分符合',
    secondOption: '十分不符合'
  },
];

export const answerOptions = {
  first: 'A',
  second: 'B',
};

export const dimensionMapping = {
  EI: { first: 'E', second: 'I' },
  SN: { first: 'S', second: 'N' },
  TF: { first: 'T', second: 'F' },
  JP: { first: 'J', second: 'P' },
};

export const dimensionLabels = {
  EI: { name: '能量方向', E: '外向 (Extraversion)', I: '内向 (Introversion)' },
  SN: { name: '信息获取', S: '感觉 (Sensing)', N: '直觉 (Intuition)' },
  TF: { name: '决策方式', T: '思考 (Thinking)', F: '情感 (Feeling)' },
  JP: { name: '生活方式', J: '判断 (Judging)', P: '知觉 (Perceiving)' },
};

// 李克特量表选项
export const likertScale = [
  { value: 5, label: '十分符合', description: '完全符合我的情况' },
  { value: 4, label: '比较符合', description: '大部分时候符合' },
  { value: 3, label: '不确定', description: '介于两者之间' },
  { value: 2, label: '不太符合', description: '少部分时候符合' },
  { value: 1, label: '十分不符合', description: '完全不符合我的情况' },
];
