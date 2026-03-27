import { MBTIType } from '@/types';

// 认知功能定义
export type CognitiveFunction = 'Ni' | 'Ne' | 'Si' | 'Se' | 'Ti' | 'Te' | 'Fi' | 'Fe';

export interface CognitiveFunctionInfo {
  name: string;
  fullName: string;
  description: string;
  strengths: string[];
  shadows: string[];
}

export const cognitiveFunctions: Record<CognitiveFunction, CognitiveFunctionInfo> = {
  // 内向直觉
  Ni: {
    name: 'Ni',
    fullName: '内向直觉 (Introverted Intuition)',
    description: '洞察未来的远见者，透过现象看本质，预测事物发展趋势。',
    strengths: ['远见卓识', '洞察规律', '战略思维', '预见未来', '深度思考'],
    shadows: ['过度猜测', '脱离现实', '固执己见', '忽视细节'],
  },
  // 外向直觉
  Ne: {
    name: 'Ne',
    fullName: '外向直觉 (Extraverted Intuition)',
    description: '充满创意的可能性探索者，善于发现事物间的联系和潜在机会。',
    strengths: ['创新思维', '发散联想', '适应变化', '发现机遇', '多角度思考'],
    shadows: ['三分钟热度', '缺乏专注', '想法过多', '难以落地'],
  },
  // 内向感觉
  Si: {
    name: 'Si',
    fullName: '内向感觉 (Introverted Sensing)',
    description: '经验的守护者，重视传统和过往经验，注重细节和稳定性。',
    strengths: ['记忆力强', '注重细节', '稳定可靠', '尊重传统', '实践经验'],
    shadows: ['固守成规', '抗拒变化', '过度比较', '沉浸过去'],
  },
  // 外向感觉
  Se: {
    name: 'Se',
    fullName: '外向感觉 (Extraverted Sensing)',
    description: '活在当下的体验者，敏锐感知周围环境，享受即时体验。',
    strengths: ['观察敏锐', '行动力强', '适应环境', '享受当下', '艺术感知'],
    shadows: ['冲动行事', '缺乏远见', '过度追求刺激', '忽视后果'],
  },
  // 内向思考
  Ti: {
    name: 'Ti',
    fullName: '内向思考 (Introverted Thinking)',
    description: '逻辑的构建者，追求内在的逻辑一致性，善于分析和分类。',
    strengths: ['逻辑严密', '分析能力', '独立思考', '追求精确', '系统思维'],
    shadows: ['过度分析', '钻牛角尖', '忽视情感', '理论脱离实际'],
  },
  // 外向思考
  Te: {
    name: 'Te',
    fullName: '外向思考 (Extraverted Thinking)',
    description: '高效的组织者，注重外在的效率和结果，善于规划和执行。',
    strengths: ['组织规划', '高效执行', '目标导向', '决策果断', '资源管理'],
    shadows: ['独断专行', '忽视感受', '过度工作', '缺乏灵活性'],
  },
  // 内向情感
  Fi: {
    name: 'Fi',
    fullName: '内向情感 (Introverted Feeling)',
    description: '真实的守护者，忠于内心价值观，追求真实和意义。',
    strengths: ['真诚善良', '价值观明确', '同理心', '自我觉察', '坚守原则'],
    shadows: ['过度敏感', '情绪化', '自我中心', '难以妥协'],
  },
  // 外向情感
  Fe: {
    name: 'Fe',
    fullName: '外向情感 (Extraverted Feeling)',
    description: '和谐的维护者，关注他人感受，善于营造和谐氛围。',
    strengths: ['善解人意', '社交能力强', '维护和谐', '关心他人', '团队合作'],
    shadows: ['过度迎合', '忽视自我', '情绪依赖', '讨好他人'],
  },
};

// 各人格类型的认知功能栈
export interface FunctionStack {
  dominant: CognitiveFunction;  // 主导功能
  auxiliary: CognitiveFunction; // 辅助功能
  tertiary: CognitiveFunction;  // 第三功能
  inferior: CognitiveFunction;  // 劣势功能
}

export const functionStackMap: Record<MBTIType, FunctionStack> = {
  // 分析家型
  INTJ: { dominant: 'Ni', auxiliary: 'Te', tertiary: 'Fi', inferior: 'Se' },
  INTP: { dominant: 'Ti', auxiliary: 'Ne', tertiary: 'Si', inferior: 'Fe' },
  ENTJ: { dominant: 'Te', auxiliary: 'Ni', tertiary: 'Se', inferior: 'Fi' },
  ENTP: { dominant: 'Ne', auxiliary: 'Ti', tertiary: 'Fe', inferior: 'Si' },

  // 外交家型
  INFJ: { dominant: 'Ni', auxiliary: 'Fe', tertiary: 'Ti', inferior: 'Se' },
  INFP: { dominant: 'Fi', auxiliary: 'Ne', tertiary: 'Si', inferior: 'Te' },
  ENFJ: { dominant: 'Fe', auxiliary: 'Ni', tertiary: 'Se', inferior: 'Ti' },
  ENFP: { dominant: 'Ne', auxiliary: 'Fi', tertiary: 'Te', inferior: 'Si' },

  // 守卫者型
  ISTJ: { dominant: 'Si', auxiliary: 'Te', tertiary: 'Fi', inferior: 'Ne' },
  ISFJ: { dominant: 'Si', auxiliary: 'Fe', tertiary: 'Ti', inferior: 'Ne' },
  ESTJ: { dominant: 'Te', auxiliary: 'Si', tertiary: 'Ne', inferior: 'Fi' },
  ESFJ: { dominant: 'Fe', auxiliary: 'Si', tertiary: 'Ne', inferior: 'Ti' },

  // 探险家型
  ISTP: { dominant: 'Ti', auxiliary: 'Se', tertiary: 'Ni', inferior: 'Fe' },
  ISFP: { dominant: 'Fi', auxiliary: 'Se', tertiary: 'Ni', inferior: 'Te' },
  ESTP: { dominant: 'Se', auxiliary: 'Ti', tertiary: 'Fe', inferior: 'Ni' },
  ESFP: { dominant: 'Se', auxiliary: 'Fi', tertiary: 'Te', inferior: 'Ni' },
};

// 获取人格类型的完整认知功能信息
export interface PersonalityFunctionData {
  type: MBTIType;
  dominant: CognitiveFunctionInfo & { position: '主导' };
  auxiliary: CognitiveFunctionInfo & { position: '辅助' };
  tertiary: CognitiveFunctionInfo & { position: '第三' };
  inferior: CognitiveFunctionInfo & { position: '劣势' };
}

export function getFunctionStack(type: MBTIType): FunctionStack {
  return functionStackMap[type];
}

export function getFullFunctionData(type: MBTIType): PersonalityFunctionData {
  const stack = functionStackMap[type];
  return {
    type,
    dominant: { ...cognitiveFunctions[stack.dominant], position: '主导' },
    auxiliary: { ...cognitiveFunctions[stack.auxiliary], position: '辅助' },
    tertiary: { ...cognitiveFunctions[stack.tertiary], position: '第三' },
    inferior: { ...cognitiveFunctions[stack.inferior], position: '劣势' },
  };
}

// 获取功能位置的描述
export function getPositionDescription(position: string): string {
  const descriptions: Record<string, string> = {
    '主导': '这是你最自然、最强大的心理功能，是你的核心驱动力。',
    '辅助': '这是你的第二强功能，支持并平衡主导功能。',
    '第三': '这是你的第三功能，在压力下或成熟后会更加发展。',
    '劣势': '这是你最弱的功能，但在个人成长中很重要。',
  };
  return descriptions[position] || '';
}

// 获取功能栈的整体描述
export function getStackOverview(type: MBTIType): string {
  const stack = getFunctionStack(type);
  const dominant = cognitiveFunctions[stack.dominant];
  const auxiliary = cognitiveFunctions[stack.auxiliary];

  return `${type} 的核心是${dominant.fullName}，这使你${dominant.description.toLowerCase()}辅助功能${auxiliary.fullName}帮助你${auxiliary.description.toLowerCase()}两者的结合形成了你独特的人格特质。`;
}
