import { personalities } from '@/lib/personalities';
import PersonalityCard from '@/components/PersonalityCard';
import Header from '@/components/Header';
import Link from 'next/link';

const personalityGroups = [
  { id: 'analysts', name: '星云 · 分析家', description: '理性而睿智的思想者，洞察本质的先知', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'], icon: '✧' },
  { id: 'diplomats', name: '月光 · 外交家', description: '富有同理心的理想主义者，温暖人心的诗人', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'], icon: '◈' },
  { id: 'sentinels', name: '山巅 · 守卫者', description: '务实而可靠的守护者，秩序的践行者', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'], icon: '◆' },
  { id: 'explorers', name: '风中 · 探险家', description: '大胆而自由的冒险者，瞬息的艺术家', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'], icon: '✦' },
];

export default function Home() {
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
                <a
                  href="#types"
                  className="btn-outline-mystical px-8 py-4 rounded-full text-base font-serif tracking-wide"
                >
                  浏览十六型
                </a>
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
    </>
  );
}
