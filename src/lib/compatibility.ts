import { MBTIType } from '@/types';

// 人格类型兼容性数据
// 基于 MBTI 理论和心理学研究
export interface CompatibilityData {
  bestMatches: MBTIType[]; // 最佳匹配
  goodMatches: MBTIType[]; // 良好匹配
  challengingMatches: MBTIType[]; // 挑战性匹配
}

// 兼容性理论说明
export const CompatibilityTheory = {
  romantic: {
    title: '恋爱关系',
    description: '基于性格互补和沟通模式的匹配度分析',
    factors: ['性格互补', '沟通方式', '价值观一致性', '情感需求'],
  },
  friendship: {
    title: '友谊关系',
    description: '基于共同兴趣和相处模式的匹配度分析',
    factors: ['共同话题', '活动偏好', '相处舒适度', '互相理解'],
  },
  work: {
    title: '工作合作',
    description: '基于工作风格和协作能力的匹配度分析',
    factors: ['工作风格', '决策方式', '沟通效率', '目标一致性'],
  },
};

// 各人格类型的兼容性数据
// 基于 MBTI 官方研究和 Keirsey 气质理论
export const compatibilityMap: Record<MBTIType, CompatibilityData> = {
  // 分析家型
  INTJ: {
    bestMatches: ['ENFP', 'ENTP', 'INFJ'],
    goodMatches: ['INTP', 'ENTJ', 'INFP'],
    challengingMatches: ['ESFP', 'ESTP', 'ISFJ'],
  },
  INTP: {
    bestMatches: ['ENTJ', 'ESTJ', 'INFJ'],
    goodMatches: ['INTJ', 'ENTP', 'INFP'],
    challengingMatches: ['ESFJ', 'ESTJ', 'ISFJ'],
  },
  ENTJ: {
    bestMatches: ['INTP', 'ISTP', 'INTJ'],
    goodMatches: ['ENTP', 'ESTJ', 'INFJ'],
    challengingMatches: ['ISFP', 'INFP', 'ESFP'],
  },
  ENTP: {
    bestMatches: ['INFJ', 'INTJ', 'ISFJ'],
    goodMatches: ['ENFP', 'ENTJ', 'INTP'],
    challengingMatches: ['ISTJ', 'ISFJ', 'ESFJ'],
  },

  // 外交家型
  INFJ: {
    bestMatches: ['ENFP', 'ENTP', 'INTP'],
    goodMatches: ['INFJ', 'ENFJ', 'INTJ'],
    challengingMatches: ['ESTP', 'ESFP', 'ISTP'],
  },
  INFP: {
    bestMatches: ['ENFJ', 'ENTJ', 'INFJ'],
    goodMatches: ['INFP', 'ENFP', 'INTJ'],
    challengingMatches: ['ESTJ', 'ESFJ', 'ISTJ'],
  },
  ENFJ: {
    bestMatches: ['INFP', 'ISFP', 'INFJ'],
    goodMatches: ['ENFP', 'ENTJ', 'ENFJ'],
    challengingMatches: ['ESTP', 'ISTP', 'ESTJ'],
  },
  ENFP: {
    bestMatches: ['INFJ', 'INTJ', 'INFP'],
    goodMatches: ['ENFJ', 'ENTP', 'ENFP'],
    challengingMatches: ['ISTJ', 'ESTJ', 'ISFJ'],
  },

  // 守卫者型
  ISTJ: {
    bestMatches: ['ESFP', 'ISFP', 'ESTJ'],
    goodMatches: ['ISTJ', 'ISFJ', 'ESTP'],
    challengingMatches: ['ENFP', 'ENTP', 'INFP'],
  },
  ISFJ: {
    bestMatches: ['ESFP', 'ESTP', 'ISFJ'],
    goodMatches: ['ISTJ', 'ESFJ', 'ISTP'],
    challengingMatches: ['ENTP', 'ENFP', 'ENTJ'],
  },
  ESTJ: {
    bestMatches: ['ISTP', 'ISFP', 'INTP'],
    goodMatches: ['ESTJ', 'ESFJ', 'ISTJ'],
    challengingMatches: ['INFP', 'ENFP', 'ENFJ'],
  },
  ESFJ: {
    bestMatches: ['ISTP', 'ISFP', 'ESTP'],
    goodMatches: ['ESFJ', 'ESTJ', 'ISFJ'],
    challengingMatches: ['INTP', 'INTJ', 'ENTP'],
  },

  // 探险家型
  ISTP: {
    bestMatches: ['ESFJ', 'ESTJ', 'ISFJ'],
    goodMatches: ['ISTP', 'ISTJ', 'ESTP'],
    challengingMatches: ['ENFJ', 'INFJ', 'ESFJ'],
  },
  ISFP: {
    bestMatches: ['ESFJ', 'ESTJ', 'ENFJ'],
    goodMatches: ['ISFP', 'ISTP', 'ESFP'],
    challengingMatches: ['ENTJ', 'ESTJ', 'INTJ'],
  },
  ESTP: {
    bestMatches: ['ISFJ', 'ISTJ', 'INFJ'],
    goodMatches: ['ESTP', 'ESFP', 'ISTP'],
    challengingMatches: ['INFJ', 'INTJ', 'INFP'],
  },
  ESFP: {
    bestMatches: ['ISTJ', 'ISFJ', 'ESTJ'],
    goodMatches: ['ESFP', 'ESTP', 'ISFP'],
    challengingMatches: ['INTJ', 'ENTJ', 'INFJ'],
  },
};

// 匹配分数计算
export interface MatchScore {
  type: MBTIType;
  score: number; // 0-100
  level: 'best' | 'good' | 'challenging';
  description: string;
}

// 计算与指定人格类型的匹配度
export function calculateMatchScore(
  userType: MBTIType,
  targetType: MBTIType,
  relationType: 'romantic' | 'friendship' | 'work' = 'romantic'
): MatchScore {
  const compatibility = compatibilityMap[userType];

  if (!compatibility) {
    return {
      type: targetType,
      score: 50,
      level: 'good',
      description: '暂无足够数据评估匹配度',
    };
  }

  let baseScore = 60;
  let level: 'best' | 'good' | 'challenging' = 'good';

  if (compatibility.bestMatches.includes(targetType)) {
    baseScore = 90;
    level = 'best';
  } else if (compatibility.goodMatches.includes(targetType)) {
    baseScore = 75;
    level = 'good';
  } else if (compatibility.challengingMatches.includes(targetType)) {
    baseScore = 45;
    level = 'challenging';
  }

  // 根据关系类型微调分数
  const adjustments = getRelationAdjustments(userType, targetType, relationType);
  const finalScore = Math.round(baseScore + adjustments);

  return {
    type: targetType,
    score: Math.max(0, Math.min(100, finalScore)),
    level,
    description: getMatchDescription(userType, targetType, level, relationType),
  };
}

// 根据关系类型调整分数
function getRelationAdjustments(
  userType: MBTIType,
  targetType: MBTIType,
  relationType: string
): number {
  // 基于性格维度差异的调整
  const userDims = getUserDimensions(userType);
  const targetDims = getUserDimensions(targetType);

  let adjustment = 0;

  // 计算维度差异
  const diffCount = [
    userDims.ei !== targetDims.ei,
    userDims.sn !== targetDims.sn,
    userDims.tf !== targetDims.tf,
    userDims.jp !== targetDims.jp,
  ].filter(Boolean).length;

  if (relationType === 'romantic') {
    // 恋爱关系：1-2 个差异最佳（互补但不过分）
    if (diffCount === 1 || diffCount === 2) {
      adjustment += 5;
    } else if (diffCount === 4) {
      adjustment -= 10;
    }
  } else if (relationType === 'friendship') {
    // 友谊关系：相似性更重要
    if (diffCount <= 1) {
      adjustment += 5;
    } else if (diffCount >= 3) {
      adjustment -= 5;
    }
  } else if (relationType === 'work') {
    // 工作关系：互补性重要
    if (diffCount === 2) {
      adjustment += 10;
    } else if (diffCount === 0) {
      adjustment -= 5;
    }
  }

  return adjustment;
}

// 获取人格类型的维度信息
function getUserDimensions(type: MBTIType) {
  return {
    ei: type[0],
    sn: type[1],
    tf: type[2],
    jp: type[3],
  };
}

// 获取匹配描述
function getMatchDescription(
  _userType: MBTIType,
  _targetType: MBTIType,
  level: 'best' | 'good' | 'challenging',
  relationType: 'romantic' | 'friendship' | 'work'
): string {
  const levelDescriptions: Record<'romantic' | 'friendship' | 'work', Record<'best' | 'good' | 'challenging', string>> = {
    romantic: {
      best: '天作之合',
      good: '和谐相处',
      challenging: '需要磨合',
    },
    friendship: {
      best: '知己好友',
      good: '志同道合',
      challenging: '需要理解',
    },
    work: {
      best: '黄金搭档',
      good: '配合默契',
      challenging: '需要沟通',
    },
  };

  return levelDescriptions[relationType][level];
}

// 获取所有类型的匹配分数排序
export function getAllMatchScores(
  userType: MBTIType,
  relationType: 'romantic' | 'friendship' | 'work' = 'romantic'
): MatchScore[] {
  const allTypes: MBTIType[] = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
  ];

  const scores = allTypes
    .filter(t => t !== userType)
    .map(t => calculateMatchScore(userType, t, relationType));

  return scores.sort((a, b) => b.score - a.score);
}

// 获取最匹配的 Top 3 类型
export function getTopMatches(
  userType: MBTIType,
  relationType: 'romantic' | 'friendship' | 'work' = 'romantic',
  limit: number = 3
): MatchScore[] {
  return getAllMatchScores(userType, relationType).slice(0, limit);
}

// 获取与指定类型的详细匹配分析
export interface DetailedMatchAnalysis {
  score: MatchScore;
  strengths: string[];
  challenges: string[];
  tips: string[];
  dimensionAnalysis: {
    ei: string;
    sn: string;
    tf: string;
    jp: string;
  };
}

export function getDetailedMatchAnalysis(
  userType: MBTIType,
  targetType: MBTIType,
  relationType: 'romantic' | 'friendship' | 'work' = 'romantic'
): DetailedMatchAnalysis {
  const score = calculateMatchScore(userType, targetType, relationType);

  const userDims = getUserDimensions(userType);
  const targetDims = getUserDimensions(targetType);

  // 维度分析
  const dimensionAnalysis = {
    ei: userDims.ei === targetDims.ei
      ? `你们都是${userDims.ei === 'E' ? '外向' : '内向'}型，能量来源相似`
      : `一个外向 (E) 一个内向 (I)，可以互补但也需要理解彼此的社交需求`,
    sn: userDims.sn === targetDims.sn
      ? `你们都倾向于${userDims.sn === 'S' ? '感觉' : '直觉'}，信息获取方式一致`
      : `一个感觉 (S) 一个直觉 (N)，看世界的方式不同，需要相互尊重`,
    tf: userDims.tf === targetDims.tf
      ? `你们都使用${userDims.tf === 'T' ? '思考' : '情感'}做决策，决策方式相同`
      : `一个思考 (T) 一个情感 (F)，决策逻辑不同，需要理解对方的考量`,
    jp: userDims.jp === targetDims.jp
      ? `你们都是${userDims.jp === 'J' ? '判断' : '知觉'}型，生活方式相似`
      : `一个判断 (J) 一个知觉 (P)，生活节奏不同，需要找到平衡点`,
  };

  // 匹配优势
  const strengths: string[] = [];
  if (score.level === 'best') {
    strengths.push('性格互补且和谐');
    strengths.push('沟通方式兼容');
    strengths.push('能够相互理解和支持');
  } else if (score.level === 'good') {
    strengths.push('有良好的相处基础');
    strengths.push('可以建立稳定的关系');
  } else {
    strengths.push('差异带来成长机会');
    strengths.push('可以学习对方的优点');
  }

  // 挑战
  const challenges: string[] = [];
  if (userDims.ei !== targetDims.ei) {
    challenges.push('社交需求差异：一个需要更多独处时间，一个需要更多社交活动');
  }
  if (userDims.sn !== targetDims.sn) {
    challenges.push('思维方式差异：一个注重实际细节，一个关注抽象概念');
  }
  if (userDims.tf !== targetDims.tf) {
    challenges.push('决策方式差异：一个理性分析，一个感性考量');
  }
  if (userDims.jp !== targetDims.jp) {
    challenges.push('生活节奏差异：一个喜欢计划，一个偏好灵活');
  }

  // 建议
  const tips: string[] = [];
  if (relationType === 'romantic') {
    tips.push('坦诚沟通，表达真实感受和需求');
    tips.push('尊重彼此的差异，不要试图改变对方');
    tips.push('找到共同的兴趣爱好和活动');
  } else if (relationType === 'friendship') {
    tips.push('保持开放心态，接纳对方的不同');
    tips.push('定期联系，维护友谊');
    tips.push('一起参与双方都喜欢的活动');
  } else {
    tips.push('明确分工，发挥各自优势');
    tips.push('定期沟通工作进展和期望');
    tips.push('尊重对方的工作方式和节奏');
  }

  return {
    score,
    strengths,
    challenges,
    tips,
    dimensionAnalysis,
  };
}
