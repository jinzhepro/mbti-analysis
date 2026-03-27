'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPersonalityByType } from '@/lib/personalities';
import { loadHistory } from '@/lib/testHistory';
import { MBTIType, TestHistoryItem } from '@/types';

interface ScoresPageProps {
  params: Promise<{ type: string }>;
}

const typeColors: Record<string, { gradient: string; border: string; bg: string; text: string }> = {
  INTJ: { gradient: 'from-indigo-500 to-purple-600', border: 'border-indigo-500/30', bg: 'from-indigo-900/30', text: 'text-indigo-300' },
  INTP: { gradient: 'from-violet-500 to-purple-600', border: 'border-violet-500/30', bg: 'from-violet-900/30', text: 'text-violet-300' },
  ENTJ: { gradient: 'from-amber-500 to-orange-600', border: 'border-amber-500/30', bg: 'from-amber-900/30', text: 'text-amber-300' },
  ENTP: { gradient: 'from-orange-500 to-red-500', border: 'border-orange-500/30', bg: 'from-orange-900/30', text: 'text-orange-300' },
  INFJ: { gradient: 'from-emerald-500 to-teal-600', border: 'border-emerald-500/30', bg: 'from-emerald-900/30', text: 'text-emerald-300' },
  INFP: { gradient: 'from-teal-500 to-cyan-600', border: 'border-teal-500/30', bg: 'from-teal-900/30', text: 'text-teal-300' },
  ENFJ: { gradient: 'from-pink-500 to-rose-600', border: 'border-pink-500/30', bg: 'from-pink-900/30', text: 'text-pink-300' },
  ENFP: { gradient: 'from-rose-500 to-pink-600', border: 'border-rose-500/30', bg: 'from-rose-900/30', text: 'text-rose-300' },
  ISTJ: { gradient: 'from-slate-500 to-gray-600', border: 'border-slate-500/30', bg: 'from-slate-900/30', text: 'text-slate-300' },
  ISFJ: { gradient: 'from-pink-400 to-rose-500', border: 'border-pink-500/30', bg: 'from-pink-900/30', text: 'text-pink-300' },
  ESTJ: { gradient: 'from-blue-500 to-indigo-600', border: 'border-blue-500/30', bg: 'from-blue-900/30', text: 'text-blue-300' },
  ESFJ: { gradient: 'from-orange-400 to-amber-500', border: 'border-orange-500/30', bg: 'from-orange-900/30', text: 'text-orange-300' },
  ISTP: { gradient: 'from-cyan-500 to-blue-600', border: 'border-cyan-500/30', bg: 'from-cyan-900/30', text: 'text-cyan-300' },
  ISFP: { gradient: 'from-lime-500 to-green-600', border: 'border-lime-500/30', bg: 'from-lime-900/30', text: 'text-lime-300' },
  ESTP: { gradient: 'from-red-500 to-orange-600', border: 'border-red-500/30', bg: 'from-red-900/30', text: 'text-red-300' },
  ESFP: { gradient: 'from-amber-400 to-yellow-500', border: 'border-amber-500/30', bg: 'from-amber-900/30', text: 'text-amber-300' },
};

// 维度详细信息
interface DimensionInfo {
  key: string;
  fullName: string;
  description: string;
  firstLetter: { letter: string; name: string; description: string };
  secondLetter: { letter: string; name: string; description: string };
}

const dimensionDetails: Record<string, DimensionInfo> = {
  EI: {
    key: 'EI',
    fullName: '能量方向 (Energy Direction)',
    description: '你从哪里获得能量，以及你倾向于如何与外界互动。',
    firstLetter: {
      letter: 'E',
      name: '外向 (Extraversion)',
      description: '从外部世界和人际互动中获得能量，倾向于行动导向，喜欢与人交流。',
    },
    secondLetter: {
      letter: 'I',
      name: '内向 (Introversion)',
      description: '从内心世界的反思和独处中获得能量，倾向于思考导向，需要独处时间恢复精力。',
    },
  },
  SN: {
    key: 'SN',
    fullName: '信息获取 (Information Gathering)',
    description: '你如何收集和处理信息，以及你倾向于关注什么类型的数据。',
    firstLetter: {
      letter: 'S',
      name: '感觉 (Sensing)',
      description: '关注具体、实际的信息，相信五官感受，注重细节和现实经验。',
    },
    secondLetter: {
      letter: 'N',
      name: '直觉 (Intuition)',
      description: '关注抽象、潜在的可能性，相信直觉和灵感，注重整体和未来趋势。',
    },
  },
  TF: {
    key: 'TF',
    fullName: '决策方式 (Decision Making)',
    description: '你如何做决定，以及你倾向于使用什么标准来判断。',
    firstLetter: {
      letter: 'T',
      name: '思考 (Thinking)',
      description: '基于逻辑、客观分析做决策，注重公平和原则，追求真理和效率。',
    },
    secondLetter: {
      letter: 'F',
      name: '情感 (Feeling)',
      description: '基于价值观、主观感受做决策，注重和谐和人情，追求意义和关怀。',
    },
  },
  JP: {
    key: 'JP',
    fullName: '生活方式 (Lifestyle Orientation)',
    description: '你如何组织外部世界，以及你倾向于如何安排你的生活。',
    firstLetter: {
      letter: 'J',
      name: '判断 (Judging)',
      description: '喜欢有计划、有组织的生活方式，追求确定性和结论，做事有条理。',
    },
    secondLetter: {
      letter: 'P',
      name: '知觉 (Perceiving)',
      description: '喜欢灵活、开放的生活方式，保持选择权和适应性，做事随性自然。',
    },
  },
};

// 获取倾向程度描述
function getTendencyDescription(percentage: number): { label: string; color: string; description: string } {
  const diff = Math.abs(percentage - 50);
  if (diff <= 10) {
    return {
      label: '轻微倾向',
      color: 'text-slate-400',
      description: '你在这个维度上比较平衡，能灵活运用两种倾向。',
    };
  } else if (diff <= 25) {
    return {
      label: '明显倾向',
      color: 'text-amber-400',
      description: '你在这个维度上有较明显的偏好，但仍能理解另一种倾向。',
    };
  } else {
    return {
      label: '强烈倾向',
      color: 'text-rose-400',
      description: '你在这个维度上有非常强烈的偏好，这是你性格的显著特征。',
    };
  }
}

export default function ScoresPage({ params }: ScoresPageProps) {
  const { type } = use(params);
  const router = useRouter();
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);
  const personality = getPersonalityByType(type as MBTIType);

  useEffect(() => {
    const history = loadHistory();
    const currentTypeResult = history.find(item => item.type === type);
    if (currentTypeResult) {
      setLatestResult({
        type: currentTypeResult.type,
        scores: currentTypeResult.scores,
      });
    }
  }, [type]);

  if (!personality) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-amber-100 mb-4">星辰未回应</h2>
          <Link href="/test" className="btn-mystical px-6 py-3 rounded-full text-sm font-serif">
            重新探索
          </Link>
        </div>
      </div>
    );
  }

  const colors = typeColors[personality.type] || typeColors.INTJ;

  const dimensions = [
    {
      ...dimensionDetails.EI,
      firstScore: latestResult?.scores.E || 0,
      secondScore: latestResult?.scores.I || 0,
    },
    {
      ...dimensionDetails.SN,
      firstScore: latestResult?.scores.S || 0,
      secondScore: latestResult?.scores.N || 0,
    },
    {
      ...dimensionDetails.TF,
      firstScore: latestResult?.scores.T || 0,
      secondScore: latestResult?.scores.F || 0,
    },
    {
      ...dimensionDetails.JP,
      firstScore: latestResult?.scores.J || 0,
      secondScore: latestResult?.scores.P || 0,
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* 头部 */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <Link
              href={`/result/${type}`}
              className="inline-flex items-center gap-2 text-amber-100/60 hover:text-amber-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回结果
            </Link>
          </div>

          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${colors.gradient} mb-6 shadow-2xl`}>
            <span className="text-5xl font-serif text-white">
              {personality.type.charAt(0)}
            </span>
          </div>
          <h1 className={`text-5xl font-serif bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent mb-3`}>
            {personality.type}
          </h1>
          <p className="text-xl font-serif text-amber-100/80">
            {personality.name}
          </p>
          <p className="text-amber-100/40 mt-2">详细得分分析</p>
        </div>

        {/* 得分总览卡片 */}
        <div className="card-mystical rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-serif text-amber-100 mb-6 flex items-center gap-2">
            <span className="text-amber-400/60">✦</span>
            维度得分总览
          </h2>

          <div className="space-y-8">
            {dimensions.map((dim) => {
              const total = dim.firstScore + dim.secondScore;
              const firstPercentage = total === 0 ? 50 : Math.round((dim.firstScore / total) * 100);
              const secondPercentage = 100 - firstPercentage;
              const dominantPercentage = Math.max(firstPercentage, secondPercentage);
              const tendency = getTendencyDescription(dominantPercentage);
              const isSecondDominant = secondPercentage > firstPercentage;

              return (
                <div key={dim.key} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                  {/* 维度标题 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${isSecondDominant ? 'text-amber-100/40' : colors.text}`}>
                        {dim.firstLetter.letter}
                      </span>
                      <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-1000 ${isSecondDominant ? 'bg-white/10' : `bg-gradient-to-r ${colors.gradient}`}`}
                          style={{ width: `${firstPercentage}%` }}
                        />
                        <div
                          className={`h-full transition-all duration-1000 ${isSecondDominant ? `bg-gradient-to-r ${colors.gradient}` : 'bg-white/10'}`}
                          style={{ width: `${secondPercentage}%` }}
                        />
                      </div>
                      <span className={`text-2xl font-bold ${isSecondDominant ? colors.text : 'text-amber-100/40'}`}>
                        {dim.secondLetter.letter}
                      </span>
                    </div>
                    <span className={`text-sm font-serif ${tendency.color}`}>
                      {tendency.label}
                    </span>
                  </div>

                  {/* 维度名称和描述 */}
                  <div className="mb-3">
                    <h3 className="text-sm font-serif text-amber-200 mb-1">{dim.fullName}</h3>
                    <p className="text-xs text-amber-100/40">{dim.description}</p>
                  </div>

                  {/* 两端详细解释 */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className={`p-4 rounded-xl border ${isSecondDominant ? 'bg-white/5 border-white/10' : `bg-gradient-to-br ${colors.bg} to-black/30 border-white/20`}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-lg font-bold ${isSecondDominant ? 'text-amber-100/60' : colors.text}`}>
                          {dim.firstLetter.letter}
                        </span>
                        <span className="text-xs text-amber-100/40">{dim.firstLetter.name}</span>
                      </div>
                      <p className="text-xs text-amber-100/60 leading-relaxed">{dim.firstLetter.description}</p>
                      <p className="text-sm font-serif text-amber-200 mt-2">{dim.firstScore} 分</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${isSecondDominant ? `bg-gradient-to-br ${colors.bg} to-black/30 border-white/20` : 'bg-white/5 border-white/10'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-lg font-bold ${isSecondDominant ? colors.text : 'text-amber-100/60'}`}>
                          {dim.secondLetter.letter}
                        </span>
                        <span className="text-xs text-amber-100/40">{dim.secondLetter.name}</span>
                      </div>
                      <p className="text-xs text-amber-100/60 leading-relaxed">{dim.secondLetter.description}</p>
                      <p className="text-sm font-serif text-amber-200 mt-2">{dim.secondScore} 分</p>
                    </div>
                  </div>

                  {/* 倾向说明 */}
                  <div className={`mt-4 p-4 rounded-xl border ${
                    tendency.label === '轻微倾向' ? 'bg-slate-900/30 border-slate-500/20' :
                    tendency.label === '明显倾向' ? 'bg-amber-900/20 border-amber-500/20' :
                    'bg-rose-900/20 border-rose-500/20'
                  }`}>
                    <div className="flex items-start gap-3">
                      <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tendency.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className={`text-xs font-serif ${tendency.color} mb-1`}>{tendency.label} · {dim.firstLetter.letter}{dim.secondLetter.letter} 维度</p>
                        <p className="text-xs text-amber-100/50 leading-relaxed">{tendency.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 得分解读 */}
        <div className="card-mystical rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-serif text-amber-100 mb-6 flex items-center gap-2">
            <span className="text-amber-400/60">◈</span>
            得分解读
          </h2>

          <div className="space-y-6 text-amber-100/70 leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="text-amber-400/60 text-lg">✧</span>
              <div>
                <h3 className="font-serif text-amber-100 mb-2">关于百分比</h3>
                <p className="text-sm">
                  每个维度的百分比显示你在该维度上的相对偏好。例如，E: 70% vs I: 30% 表示你在能量获取方面明显倾向于外向，
                  但这不代表你只有 70% 的时间是外向的，而是表示你的外向偏好强度是内向的 2.3 倍。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-amber-400/60 text-lg">◈</span>
              <div>
                <h3 className="font-serif text-amber-100 mb-2">关于倾向程度</h3>
                <p className="text-sm">
                  <span className="text-slate-400">轻微倾向（55%-60%）</span>：你在该维度上比较平衡，能根据情境灵活运用两种倾向。<br/>
                  <span className="text-amber-400">明显倾向（61%-75%）</span>：你有较明显的偏好，但在需要时也能使用另一种倾向。<br/>
                  <span className="text-rose-400">强烈倾向（76% 以上）</span>：你有非常强烈的偏好，这是你性格的核心特征。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-amber-400/60 text-lg">✦</span>
              <div>
                <h3 className="font-serif text-amber-100 mb-2">重要提醒</h3>
                <p className="text-sm">
                  MBTI 测量的是偏好，不是能力。得分低不代表你不擅长某事，只表示那不是你的自然倾向。
                  每个人都能发展所有维度的功能，只是需要不同的努力程度。了解自己的偏好有助于发挥优势，
                  同时有意识地发展相对较弱的功能。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <button
            onClick={() => router.push(`/result/${type}`)}
            className="flex-1 btn-mystical py-4 rounded-xl text-base font-serif tracking-wide"
          >
            返回结果
          </button>
          <Link
            href="/"
            className="flex-1 btn-outline-mystical py-4 rounded-xl text-base font-serif tracking-wide text-center"
          >
            返回星域
          </Link>
        </div>
      </div>
    </div>
  );
}

interface TestResult {
  type: MBTIType;
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
}
