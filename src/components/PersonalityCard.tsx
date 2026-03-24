import Link from 'next/link';
import { PersonalityType } from '@/types';

interface PersonalityCardProps {
  personality: PersonalityType;
}

const typeColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  INTJ: { bg: 'from-indigo-900/50', border: 'border-indigo-500/30', text: 'text-indigo-300', glow: 'shadow-indigo-500/20' },
  INTP: { bg: 'from-violet-900/50', border: 'border-violet-500/30', text: 'text-violet-300', glow: 'shadow-violet-500/20' },
  ENTJ: { bg: 'from-amber-900/50', border: 'border-amber-500/30', text: 'text-amber-300', glow: 'shadow-amber-500/20' },
  ENTP: { bg: 'from-orange-900/50', border: 'border-orange-500/30', text: 'text-orange-300', glow: 'shadow-orange-500/20' },
  INFJ: { bg: 'from-emerald-900/50', border: 'border-emerald-500/30', text: 'text-emerald-300', glow: 'shadow-emerald-500/20' },
  INFP: { bg: 'from-teal-900/50', border: 'border-teal-500/30', text: 'text-teal-300', glow: 'shadow-teal-500/20' },
  ENFJ: { bg: 'from-pink-900/50', border: 'border-pink-500/30', text: 'text-pink-300', glow: 'shadow-pink-500/20' },
  ENFP: { bg: 'from-rose-900/50', border: 'border-rose-500/30', text: 'text-rose-300', glow: 'shadow-rose-500/20' },
  ISTJ: { bg: 'from-slate-900/50', border: 'border-slate-500/30', text: 'text-slate-300', glow: 'shadow-slate-500/20' },
  ISFJ: { bg: 'from-rose-900/50', border: 'border-rose-500/30', text: 'text-rose-300', glow: 'shadow-rose-500/20' },
  ESTJ: { bg: 'from-blue-900/50', border: 'border-blue-500/30', text: 'text-blue-300', glow: 'shadow-blue-500/20' },
  ESFJ: { bg: 'from-orange-900/50', border: 'border-orange-500/30', text: 'text-orange-300', glow: 'shadow-orange-500/20' },
  ISTP: { bg: 'from-cyan-900/50', border: 'border-cyan-500/30', text: 'text-cyan-300', glow: 'shadow-cyan-500/20' },
  ISFP: { bg: 'from-lime-900/50', border: 'border-lime-500/30', text: 'text-lime-300', glow: 'shadow-lime-500/20' },
  ESTP: { bg: 'from-red-900/50', border: 'border-red-500/30', text: 'text-red-300', glow: 'shadow-red-500/20' },
  ESFP: { bg: 'from-yellow-900/50', border: 'border-yellow-500/30', text: 'text-yellow-300', glow: 'shadow-yellow-500/20' },
};

export default function PersonalityCard({ personality }: PersonalityCardProps) {
  const colors = typeColors[personality.type] || typeColors.INTJ;

  return (
    <Link
      href={`/result/${personality.type}`}
      className={`group relative block h-full p-6 rounded-2xl bg-gradient-to-br ${colors.bg} to-black/50 border ${colors.border} backdrop-blur-sm hover:border-amber-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg ${colors.glow}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      
      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-3xl font-serif font-bold ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
            {personality.type}
          </h3>
          <span className="text-xs text-amber-100/40 uppercase tracking-[0.2em]">
            {personality.nickname}
          </span>
        </div>

        <h4 className="text-xl font-serif text-amber-100/90 mb-3 group-hover:text-amber-200 transition-colors">
          {personality.name}
        </h4>

        <p className="text-amber-100/50 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
          {personality.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {personality.traits.slice(0, 3).map((trait, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs text-amber-100/60 bg-white/5 rounded-full border border-white/10"
            >
              {trait}
            </span>
          ))}
        </div>

        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
