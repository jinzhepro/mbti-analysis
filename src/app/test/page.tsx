'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { testQuestions, dimensionLabels, likertScale } from '@/lib/questions';
import { quickQuestions } from '@/lib/quickQuestions';
import { calculateResult, calculateQuickResult, AnswerRecord } from '@/lib/testStore';
import { saveToHistory, loadHistory, formatTimestamp } from '@/lib/testHistory';
import { TestResult, TestHistoryItem } from '@/types';

const STORAGE_KEY = 'mbti_test_progress';
const QUICK_STORAGE_KEY = 'mbti_quick_test_progress';

const dimensionLabelsMap: Record<string, { name: string; icon: string }> = {
  EI: { name: '能量 · 外向/内向', icon: '◈' },
  SN: { name: '感知 · 感觉/直觉', icon: '✧' },
  TF: { name: '判断 · 思考/情感', icon: '◆' },
  JP: { name: '态度 · 判断/知觉', icon: '✦' },
};

const typeColors: Record<string, { gradient: string; text: string }> = {
  INTJ: { gradient: 'from-indigo-500 to-purple-600', text: 'text-indigo-300' },
  INTP: { gradient: 'from-violet-500 to-purple-600', text: 'text-violet-300' },
  ENTJ: { gradient: 'from-amber-500 to-orange-600', text: 'text-amber-300' },
  ENTP: { gradient: 'from-orange-500 to-red-500', text: 'text-orange-300' },
  INFJ: { gradient: 'from-emerald-500 to-teal-600', text: 'text-emerald-300' },
  INFP: { gradient: 'from-teal-500 to-cyan-600', text: 'text-teal-300' },
  ENFJ: { gradient: 'from-pink-500 to-rose-600', text: 'text-pink-300' },
  ENFP: { gradient: 'from-rose-500 to-pink-600', text: 'text-rose-300' },
  ISTJ: { gradient: 'from-slate-500 to-gray-600', text: 'text-slate-300' },
  ISFJ: { gradient: 'from-pink-400 to-rose-500', text: 'text-pink-300' },
  ESTJ: { gradient: 'from-blue-500 to-indigo-600', text: 'text-blue-300' },
  ESFJ: { gradient: 'from-orange-400 to-amber-500', text: 'text-orange-300' },
  ISTP: { gradient: 'from-cyan-500 to-blue-600', text: 'text-cyan-300' },
  ISFP: { gradient: 'from-lime-500 to-green-600', text: 'text-lime-300' },
  ESTP: { gradient: 'from-red-500 to-orange-600', text: 'text-red-300' },
  ESFP: { gradient: 'from-amber-400 to-yellow-500', text: 'text-amber-300' },
};

type TestMode = 'select' | 'full' | 'quick';

interface TestProgress {
  currentIndex: number;
  answers: AnswerRecord;
}

function loadProgress(storageKey: string): TestProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('加载进度失败:', err);
  }
  return null;
}

function saveProgress(storageKey: string, currentIndex: number, answers: AnswerRecord) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey, JSON.stringify({ currentIndex, answers }));
  } catch (err) {
    console.error('保存进度失败:', err);
  }
}

function clearProgress(storageKey: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(storageKey);
  } catch (err) {
    console.error('清除进度失败:', err);
  }
}

export default function TestPage() {
  const router = useRouter();
  const [testMode, setTestMode] = useState<TestMode>('select');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord>({});
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<TestHistoryItem[]>([]);

  const currentQuestions = testMode === 'quick' ? quickQuestions : testQuestions;
  const storageKey = testMode === 'quick' ? QUICK_STORAGE_KEY : STORAGE_KEY;
  const isQuickTest = testMode === 'quick';

  useEffect(() => {
    if (showHistory) {
      setHistory(loadHistory());
    }
  }, [showHistory]);

  useEffect(() => {
    const saved = loadProgress(storageKey);
    if (saved && saved.answers && Object.keys(saved.answers).length > 0) {
      setCurrentIndex(saved.currentIndex);
      setAnswers(saved.answers);
    }
    setHasLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (hasLoaded && !isFinished && testMode !== 'select') {
      saveProgress(storageKey, currentIndex, answers);
    }
  }, [currentIndex, answers, hasLoaded, isFinished, storageKey, testMode]);

  const currentQuestion = currentQuestions[currentIndex];
  const progress = ((currentIndex + 1) / currentQuestions.length) * 100;
  const dimension = dimensionLabelsMap[currentQuestion?.dimension];

  const handleAnswer = useCallback((score: number) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: score,
    };
    setAnswers(newAnswers);

    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const calculateFn = isQuickTest ? calculateQuickResult : calculateResult;
      const testResult = calculateFn(newAnswers);
      setResult(testResult);
      setIsFinished(true);
      saveToHistory(testResult);
      clearProgress(storageKey);
    }
  }, [currentIndex, currentQuestion?.id, answers, isQuickTest, storageKey]);

  const handleViewResult = useCallback(() => {
    if (result) {
      router.push(`/result/${result.type}`);
    }
  }, [result, router]);

  const handleRestart = useCallback(() => {
    clearProgress(storageKey);
    setCurrentIndex(0);
    setAnswers({});
    setIsFinished(false);
    setResult(null);
    setTestMode('select');
  }, [storageKey]);

  const handleModeSelect = useCallback((mode: 'full' | 'quick') => {
    setTestMode(mode);
    setCurrentIndex(0);
    setAnswers({});
    setIsFinished(false);
    setResult(null);
  }, []);

  // 模式选择页面
  if (testMode === 'select') {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/30 mb-6">
                <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif text-amber-100 mb-4">
                选择测试模式
              </h2>
              <p className="text-amber-100/50">
                根据你的需求选择合适的测试模式
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 完整版测试卡片 */}
              <button
                onClick={() => handleModeSelect('full')}
                className="card-mystical rounded-2xl p-8 text-left group hover:bg-white/5 transition-all animate-fade-in-up"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-amber-100 group-hover:text-amber-200">完整版测试</h3>
                    <p className="text-amber-100/40 text-sm">40 题 · 约 10 分钟</p>
                  </div>
                </div>
                <p className="text-amber-100/60 text-sm leading-relaxed mb-4">
                  适合首次测试的用户。包含 40 道精心设计的题目，覆盖四个人格维度，结果更加准确可靠。
                </p>
                <div className="flex items-center gap-2 text-amber-400/80 text-sm font-serif">
                  <span>开始完整测试</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* 快速版测试卡片 */}
              <button
                onClick={() => handleModeSelect('quick')}
                className="card-mystical rounded-2xl p-8 text-left group hover:bg-white/5 transition-all animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-amber-100 group-hover:text-amber-200">快速复核测试</h3>
                    <p className="text-amber-100/40 text-sm">12 题 · 约 3 分钟</p>
                  </div>
                </div>
                <p className="text-amber-100/60 text-sm leading-relaxed mb-4">
                  适合已做过完整版测试，想要快速复核人格类型的用户。题目精选自完整版，保留最具区分度的问题。
                </p>
                <div className="flex items-center gap-2 text-amber-400/80 text-sm font-serif">
                  <span>开始快速测试</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            {/* 提示信息 */}
            <div className="mt-8 p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-amber-100/60 text-sm leading-relaxed">
                  <p className="font-serif text-amber-100/80 mb-1">测试说明</p>
                  <p>每道题目采用李克特 5 点量表，请根据您的真实感受选择符合程度。没有对错之分，请如实作答。</p>
                </div>
              </div>
            </div>

            {/* 查看历史按钮 */}
            <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => setShowHistory(true)}
                className="text-amber-100/40 hover:text-amber-200 text-sm font-serif flex items-center gap-2 transition-colors mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                查看测试历史
              </button>
            </div>
          </div>
        </div>

        {/* 测试历史模态框 */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setShowHistory(false)}>
            <div className="relative max-w-4xl w-full max-h-[80vh] overflow-y-auto rounded-2xl card-mystical p-8" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowHistory(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-serif text-amber-100 mb-2">测试历史</h2>
                <p className="text-amber-100/40 text-sm">最多保存最近 10 次测试结果</p>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 text-amber-100/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-amber-100/40">暂无测试记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => {
                    const itemColors = typeColors[item.type] || typeColors.INTJ;
                    return (
                      <div key={item.id} className="card-mystical rounded-xl p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${itemColors.gradient} flex items-center justify-center`}>
                            <span className="text-xl font-serif text-white font-bold">{item.type.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-serif ${itemColors.text} font-bold`}>{item.type}</span>
                              {index === 0 && <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">最新</span>}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-amber-100/40 mt-1">
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatTimestamp(item.timestamp)}
                              </span>
                              <span>E:{item.scores.E} I:{item.scores.I} S:{item.scores.S} N:{item.scores.N} T:{item.scores.T} F:{item.scores.F} J:{item.scores.J} P:{item.scores.P}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { router.push(`/result/${item.type}`); setShowHistory(false); }} className="px-4 py-2 text-sm text-amber-100/60 hover:text-amber-200 transition-colors">
                            查看
                          </button>
                          <button onClick={() => { import('@/lib/testHistory').then(mod => { mod.deleteHistoryItem(item.id); setHistory(loadHistory()); }); }} className="w-8 h-8 flex items-center justify-center text-amber-100/30 hover:text-rose-400 transition-colors" title="删除记录">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {history.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <button onClick={() => { if (confirm('确定要清空所有测试历史吗？')) { import('@/lib/testHistory').then(mod => { mod.clearHistory(); setHistory([]); }); } }} className="text-amber-100/40 hover:text-rose-400 text-sm transition-colors">
                    清空所有历史
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // 测试结果页面
  if (isFinished && result) {
    const scores = result.scores;
    const totalPerDimension = isQuickTest ? 15 : 50; // 快速测试满分 15，完整测试满分 50

    return (
      <>
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
                你已完成所有 {currentQuestions.length} 道问题的探索
                {isQuickTest && <span className="block text-amber-100/40 text-sm mt-1">快速复核测试</span>}
              </p>
            </div>

            <div className="card-mystical rounded-2xl p-8 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-serif text-amber-100 mb-6 text-center">各维度得分</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-100/60 text-sm font-serif">{dimensionLabels.EI.name}</span>
                    <span className="text-amber-400/80 text-sm">E: {scores.E} / I: {scores.I}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-1000" style={{ width: `${(scores.E / totalPerDimension) * 100}%` }} />
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full transition-all duration-1000" style={{ width: `${(scores.I / totalPerDimension) * 100}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-amber-100/40">{dimensionLabels.EI.E}</span>
                    <span className="text-xs text-amber-100/40">{dimensionLabels.EI.I}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-100/60 text-sm font-serif">{dimensionLabels.SN.name}</span>
                    <span className="text-amber-400/80 text-sm">S: {scores.S} / N: {scores.N}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full transition-all duration-1000" style={{ width: `${(scores.S / totalPerDimension) * 100}%` }} />
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-1000" style={{ width: `${(scores.N / totalPerDimension) * 100}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-amber-100/40">{dimensionLabels.SN.S}</span>
                    <span className="text-xs text-amber-100/40">{dimensionLabels.SN.N}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-100/60 text-sm font-serif">{dimensionLabels.TF.name}</span>
                    <span className="text-amber-400/80 text-sm">T: {scores.T} / F: {scores.F}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-1000" style={{ width: `${(scores.T / totalPerDimension) * 100}%` }} />
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 h-full transition-all duration-1000" style={{ width: `${(scores.F / totalPerDimension) * 100}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-amber-100/40">{dimensionLabels.TF.T}</span>
                    <span className="text-xs text-amber-100/40">{dimensionLabels.TF.F}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-100/60 text-sm font-serif">{dimensionLabels.JP.name}</span>
                    <span className="text-amber-400/80 text-sm">J: {scores.J} / P: {scores.P}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-1000" style={{ width: `${(scores.J / totalPerDimension) * 100}%` }} />
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-full transition-all duration-1000" style={{ width: `${(scores.P / totalPerDimension) * 100}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-amber-100/40">{dimensionLabels.JP.J}</span>
                    <span className="text-xs text-amber-100/40">{dimensionLabels.JP.P}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 text-center">
                <p className="text-amber-100/60 text-sm mb-2">你的人格类型是</p>
                <div className="text-5xl font-serif bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  {result.type}
                </div>
              </div>
            </div>

            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button onClick={handleViewResult} className="w-full btn-mystical py-5 rounded-xl text-base font-serif tracking-wide">
                查看详细分析
              </button>
              <div className="flex gap-4">
                <button onClick={handleRestart} className="flex-1 btn-outline-mystical py-5 rounded-xl text-base font-serif tracking-wide">
                  返回选择
                </button>
                <button onClick={() => setShowHistory(true)} className="flex-1 btn-outline-mystical py-5 rounded-xl text-base font-serif tracking-wide">
                  查看历史
                </button>
              </div>
            </div>
          </div>
        </div>

        {showHistory && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setShowHistory(false)}>
            <div className="relative max-w-4xl w-full max-h-[80vh] overflow-y-auto rounded-2xl card-mystical p-8" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowHistory(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-serif text-amber-100 mb-2">测试历史</h2>
                <p className="text-amber-100/40 text-sm">最多保存最近 10 次测试结果</p>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 text-amber-100/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-amber-100/40">暂无测试记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => {
                    const itemColors = typeColors[item.type] || typeColors.INTJ;
                    return (
                      <div key={item.id} className="card-mystical rounded-xl p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${itemColors.gradient} flex items-center justify-center`}>
                            <span className="text-xl font-serif text-white font-bold">{item.type.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-serif ${itemColors.text} font-bold`}>{item.type}</span>
                              {index === 0 && <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">最新</span>}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-amber-100/40 mt-1">
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatTimestamp(item.timestamp)}
                              </span>
                              <span>E:{item.scores.E} I:{item.scores.I} S:{item.scores.S} N:{item.scores.N} T:{item.scores.T} F:{item.scores.F} J:{item.scores.J} P:{item.scores.P}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { router.push(`/result/${item.type}`); setShowHistory(false); }} className="px-4 py-2 text-sm text-amber-100/60 hover:text-amber-200 transition-colors">
                            查看
                          </button>
                          <button onClick={() => { import('@/lib/testHistory').then(mod => { mod.deleteHistoryItem(item.id); setHistory(loadHistory()); }); }} className="w-8 h-8 flex items-center justify-center text-amber-100/30 hover:text-rose-400 transition-colors" title="删除记录">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {history.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <button onClick={() => { if (confirm('确定要清空所有测试历史吗？')) { import('@/lib/testHistory').then(mod => { mod.clearHistory(); setHistory([]); }); } }} className="text-amber-100/40 hover:text-rose-400 text-sm transition-colors">
                    清空所有历史
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  if (!hasLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-100/60 font-serif">正在加载星辰指引...</p>
        </div>
      </div>
    );
  }

  const hasSavedProgress = Object.keys(answers).length > 0 && currentIndex > 0;

  // 测试进行页面
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {hasSavedProgress && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between animate-fade-in-up">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-amber-100/80 text-sm font-serif">
                  已恢复上次探索进度（第 {currentIndex + 1} 题）
                  {isQuickTest && <span className="ml-2 text-amber-100/60">· 快速测试</span>}
                </span>
              </div>
              <button onClick={handleRestart} className="text-amber-100/40 text-xs hover:text-amber-200 transition-colors">
                重新开始
              </button>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-100/40 text-sm font-serif tracking-wide">
                第 {currentIndex + 1} / {currentQuestions.length} 颗星
              </span>
              <span className="text-amber-400/60 text-sm">
                {Math.round(progress)}% 已探索
              </span>
            </div>
            <div className="h-px bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="card-mystical rounded-2xl p-8 md:p-12">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-amber-400/60">{dimension.icon}</span>
                <span className="text-amber-400/60 text-sm font-serif tracking-wider">{dimension.name}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-amber-100 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

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
                        <span className="text-amber-100/90 font-serif">{option.label}</span>
                        <p className="text-amber-100/40 text-xs mt-0.5">{option.description}</p>
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
              <button onClick={handleRestart} className="text-amber-100/30 text-sm hover:text-amber-400/60 transition-colors">
                从头开始
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
