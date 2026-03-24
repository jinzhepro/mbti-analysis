'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { testQuestions, dimensionLabels, likertScale } from '@/lib/questions';
import { calculateResult, AnswerRecord } from '@/lib/testStore';
import { TestResult } from '@/types';

const dimensionLabelsMap: Record<string, { name: string; icon: string }> = {
  EI: { name: '能量 · 外向/内向', icon: '◈' },
  SN: { name: '感知 · 感觉/直觉', icon: '✧' },
  TF: { name: '判断 · 思考/情感', icon: '◆' },
  JP: { name: '态度 · 判断/知觉', icon: '✦' },
};

export default function TestPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord>({});
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const currentQuestion = testQuestions[currentIndex];
  const progress = ((currentIndex + 1) / testQuestions.length) * 100;
  const dimension = dimensionLabelsMap[currentQuestion.dimension];

  const handleAnswer = useCallback((score: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: score,
    }));

    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const testResult = calculateResult({ ...answers, [currentQuestion.id]: score });
      setResult(testResult);
      setIsFinished(true);
    }
  }, [currentIndex, currentQuestion.id, answers]);

  const handleViewResult = useCallback(() => {
    if (result) {
      router.push(`/result/${result.type}`);
    }
  }, [result, router]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setIsFinished(false);
    setResult(null);
  }, []);

  if (isFinished && result) {
    const scores = result.scores;
    const totalPerDimension = 50; // 10 题 * 5 分

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/30 mb-6">
              <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif text-amber-100 mb-4">
              星辰已回应
            </h2>
            <p className="text-amber-100/50 mb-8">
              你已完成所有 {testQuestions.length} 道问题的探索
            </p>
          </div>

          {/* 维度得分 */}
          <div className="card-mystical rounded-2xl p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-serif text-amber-100 mb-6 text-center">各维度得分</h3>
            
            <div className="space-y-6">
              {/* E-I 维度 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-100/60 text-sm font-serif">{dimensionLabels.EI.name}</span>
                  <span className="text-amber-400/80 text-sm">
                    E: {scores.E} / I: {scores.I}
                  </span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-1000"
                    style={{ width: `${(scores.E / totalPerDimension) * 100}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full transition-all duration-1000"
                    style={{ width: `${(scores.I / totalPerDimension) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-amber-100/40">{dimensionLabels.EI.E}</span>
                  <span className="text-xs text-amber-100/40">{dimensionLabels.EI.I}</span>
                </div>
              </div>

              {/* S-N 维度 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-100/60 text-sm font-serif">{dimensionLabels.SN.name}</span>
                  <span className="text-amber-400/80 text-sm">
                    S: {scores.S} / N: {scores.N}
                  </span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full transition-all duration-1000"
                    style={{ width: `${(scores.S / totalPerDimension) * 100}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-1000"
                    style={{ width: `${(scores.N / totalPerDimension) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-amber-100/40">{dimensionLabels.SN.S}</span>
                  <span className="text-xs text-amber-100/40">{dimensionLabels.SN.N}</span>
                </div>
              </div>

              {/* T-F 维度 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-100/60 text-sm font-serif">{dimensionLabels.TF.name}</span>
                  <span className="text-amber-400/80 text-sm">
                    T: {scores.T} / F: {scores.F}
                  </span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-1000"
                    style={{ width: `${(scores.T / totalPerDimension) * 100}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-pink-600 h-full transition-all duration-1000"
                    style={{ width: `${(scores.F / totalPerDimension) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-amber-100/40">{dimensionLabels.TF.T}</span>
                  <span className="text-xs text-amber-100/40">{dimensionLabels.TF.F}</span>
                </div>
              </div>

              {/* J-P 维度 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-100/60 text-sm font-serif">{dimensionLabels.JP.name}</span>
                  <span className="text-amber-400/80 text-sm">
                    J: {scores.J} / P: {scores.P}
                  </span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-1000"
                    style={{ width: `${(scores.J / totalPerDimension) * 100}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-full transition-all duration-1000"
                    style={{ width: `${(scores.P / totalPerDimension) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-amber-100/40">{dimensionLabels.JP.J}</span>
                  <span className="text-xs text-amber-100/40">{dimensionLabels.JP.P}</span>
                </div>
              </div>
            </div>

            {/* 最终结果 */}
            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-amber-100/60 text-sm mb-2">你的人格类型是</p>
              <div className="text-5xl font-serif bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                {result.type}
              </div>
            </div>
          </div>
          
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handleViewResult}
              className="w-full btn-mystical py-5 rounded-xl text-base font-serif tracking-wide"
            >
              查看详细分析
            </button>
            <button
              onClick={handleRestart}
              className="w-full btn-outline-mystical py-5 rounded-xl text-base font-serif tracking-wide"
            >
              重新探索
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-amber-100/40 text-sm font-serif tracking-wide">
              第 {currentIndex + 1} / {testQuestions.length} 颗星
            </span>
            <span className="text-amber-400/60 text-sm">
              {Math.round(progress)}% 已探索
            </span>
          </div>
          <div className="h-px bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="card-mystical rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-400/60">{dimension.icon}</span>
              <span className="text-amber-400/60 text-sm font-serif tracking-wider">
                {dimension.name}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif text-amber-100 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* 李克特量表选项 */}
          <div className="space-y-3">
            {likertScale.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 text-left rounded-xl border transition-all duration-300 group ${
                  index === 0 ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20' :
                  index === 4 ? 'bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20' :
                  'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-serif text-sm mr-4 ${
                      index === 0 ? 'bg-amber-500/30 text-amber-300' :
                      index === 4 ? 'bg-indigo-500/30 text-indigo-300' :
                      'bg-white/10 text-amber-100/60'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <span className="text-amber-100/90 font-serif">
                        {option.label}
                      </span>
                      <p className="text-amber-100/40 text-xs mt-0.5">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-amber-100/30 text-xs group-hover:text-amber-100/60 transition-colors">
                    选择
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleRestart}
              className="text-amber-100/30 text-sm hover:text-amber-400/60 transition-colors"
            >
              从头开始
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
