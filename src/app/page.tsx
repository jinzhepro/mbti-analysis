'use client';

import { useState, useEffect } from 'react';
import { personalities } from '@/lib/personalities';
import PersonalityCard from '@/components/PersonalityCard';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loadHistory, formatTimestamp, clearHistory } from '@/lib/testHistory';
import { TestHistoryItem } from '@/types';

const personalityGroups = [
  { id: 'analysts', name: '星云 · 分析家', description: '理性而睿智的思想者，洞察本质的先知', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'], icon: '✧' },
  { id: 'diplomats', name: '月光 · 外交家', description: '富有同理心的理想主义者，温暖人心的诗人', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'], icon: '◈' },
  { id: 'sentinels', name: '山巅 · 守卫者', description: '务实而可靠的守护者，秩序的践行者', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'], icon: '◆' },
  { id: 'explorers', name: '风中 · 探险家', description: '大胆而自由的冒险者，瞬息的艺术家', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'], icon: '✦' },
];

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

export default function Home() {
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<TestHistoryItem[]>([]);

  useEffect(() => {
    if (showHistory) {
      setHistory(loadHistory());
    }
  }, [showHistory]);

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
            <div className="w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl -translate-x-20" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 text-xs tracking-[0.3em] text-amber-400/60 border border-amber-500/20 rounded-full mb-6">
                THE STARS GUIDE YOUR SOUL
              </span>
              <h1 className="text-5xl md:text-7xl font-serif text-amber-100 mb-6 leading-tight">
                探索你的
                <span className="block text-gradient-gold">人格星辰</span>
              </h1>
              <p className="text-lg md:text-xl text-amber-100/60 max-w-2xl mx-auto leading-relaxed mb-10">
                在星光的指引下，踏上自我认知的旅程。<br className="hidden md:block" />
                MBTI 十六型人格，帮你发现内心深处的本质。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/test"
                  className="btn-mystical px-8 py-4 rounded-full text-base font-serif tracking-wide"
                >
                  开始星辰探索
                </Link>
                <span className="text-amber-100/30 text-sm">或</span>
                <button
                  onClick={() => setShowHistory(true)}
                  className="btn-outline-mystical px-8 py-4 rounded-full text-base font-serif tracking-wide flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  查看历史
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 人格类型分组 */}
        <div className="max-w-6xl mx-auto px-6 pb-24 space-y-20" id="types">
          {personalityGroups.map((group, groupIndex) => {
            const groupPersonalities = personalities.filter(p => group.types.includes(p.type));
            return (
              <section key={group.id} className="animate-fade-in-up" style={{ animationDelay: `${groupIndex * 0.1}s` }}>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-2xl text-amber-400/60">{group.icon}</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif text-amber-100">
                      {group.name}
                    </h2>
                    <p className="text-amber-100/40 text-sm mt-1">{group.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {groupPersonalities.map((personality, index) => (
                    <div
                      key={personality.type}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${(groupIndex * 0.1) + (index * 0.05)}s` }}
                    >
                      <PersonalityCard personality={personality} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* 关于 MBTI */}
        <section className="py-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 text-xs tracking-[0.2em] text-amber-400/60 border border-amber-500/10 rounded-full mb-4">
                关于 MBTI
              </span>
              <h2 className="text-3xl font-serif text-amber-100 mb-4">
                十六型人格理论
              </h2>
              <p className="text-amber-100/50 max-w-2xl mx-auto leading-relaxed">
                MBTI（Myers-Briggs Type Indicator）源于卡尔·荣格的心理学理论，
                通过四个维度解析人的性格特征，帮助我们更好地理解自己与他人。
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { letter: 'E / I', name: '外向 · 内向', desc: '能量来源' },
                { letter: 'S / N', name: '感觉 · 直觉', desc: '信息获取' },
                { letter: 'T / F', name: '思考 · 情感', desc: '决策方式' },
                { letter: 'J / P', name: '判断 · 知觉', desc: '生活态度' },
              ].map((item) => (
                <div
                  key={item.letter}
                  className="text-center p-6 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all duration-300"
                >
                  <div className="text-2xl font-serif text-amber-300/80 mb-2 tracking-wider">
                    {item.letter}
                  </div>
                  <div className="text-amber-100/80 text-sm font-serif mb-1">{item.name}</div>
                  <div className="text-amber-100/30 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-amber-100/30 text-sm">
              © 2024 人格星辰 · MBTI 人格分析 · 仅供学习参考
            </p>
          </div>
        </footer>
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
                <Link href="/test" className="mt-4 btn-mystical px-6 py-2 rounded-full text-sm font-serif inline-block">
                  开始测试
                </Link>
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
                <button onClick={() => { if (confirm('确定要清空所有测试历史吗？')) { clearHistory(); setHistory([]); } }} className="text-amber-100/40 hover:text-rose-400 text-sm transition-colors">
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
