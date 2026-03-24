'use client';

import { use, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import { getPersonalityByType } from '@/lib/personalities';
import { MBTIType } from '@/types';

interface ResultPageProps {
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

export default function ResultPage({ params }: ResultPageProps) {
  const { type } = use(params);
  const router = useRouter();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareType, setCompareType] = useState<MBTIType | ''>('');
  const shareContentRef = useRef<HTMLDivElement>(null);
  const personality = getPersonalityByType(type as MBTIType);

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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `我的 MBTI 人格类型是 ${personality.type} - ${personality.name}`;
  const shareDescription = personality.description;

  const handleShare = async (platform: string) => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(shareTitle);
    const text = encodeURIComponent(`${shareTitle}\n${shareDescription}`);
    
    const shareLinks: Record<string, string> = {
      wechat: `weixin://`,
      weibo: `https://service.weibo.com/share/share.php?url=${url}&title=${text}`,
      qq: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&title=${text}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      copy: 'copy',
      image: 'image',
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('链接已复制到剪贴板！');
      } catch (err) {
        console.error('复制失败:', err);
      }
    } else if (platform === 'image') {
      await handleGenerateImage();
    } else if (platform === 'wechat') {
      alert('请在微信中打开此页面进行分享');
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const handleGenerateImage = async () => {
    if (!shareContentRef.current) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(shareContentRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#0a0a12',
      });
      
      setGeneratedImageUrl(dataUrl);
      setShowImageModal(true);
    } catch (err) {
      console.error('生成图片失败:', err);
      alert('生成图片失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* 头部 */}
        <div className="text-center mb-16">
          <div className="flex justify-end mb-4">
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="btn-outline-mystical px-4 py-2 rounded-full text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                分享
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 card-mystical rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                  <div className="py-2">
                    <button
                      onClick={() => handleShare('weibo')}
                      className="w-full px-4 py-2 text-left text-sm text-amber-100/80 hover:bg-white/5 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      分享到微博
                    </button>
                    <button
                      onClick={() => handleShare('qq')}
                      className="w-full px-4 py-2 text-left text-sm text-amber-100/80 hover:bg-white/5 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      分享到 QQ 空间
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full px-4 py-2 text-left text-sm text-amber-100/80 hover:bg-white/5 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-blue-400 rounded-full" />
                      分享到 Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full px-4 py-2 text-left text-sm text-amber-100/80 hover:bg-white/5 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-blue-600 rounded-full" />
                      分享到 Facebook
                    </button>
                    <button
                      onClick={() => handleShare('wechat')}
                      className="w-full px-4 py-2 text-left text-sm text-amber-100/80 hover:bg-white/5 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      分享到微信
                    </button>
                    <div className="border-t border-white/5 my-1" />
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full px-4 py-2 text-left text-sm text-amber-100/80 hover:bg-white/5 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      复制链接
                    </button>
                    <button
                      onClick={() => handleShare('image')}
                      className="w-full px-4 py-2 text-left text-sm text-amber-100/80 hover:bg-white/5 flex items-center gap-2"
                      disabled={isGenerating}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {isGenerating ? '生成中...' : '生成分享图片'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${colors.gradient} mb-8 shadow-2xl`}>
            <span className="text-6xl font-serif text-white">
              {personality.type.charAt(0)}
            </span>
          </div>
          <div className="mb-2">
            <span className={`text-sm tracking-[0.4em] uppercase ${colors.text}`}>
              {personality.nickname}
            </span>
          </div>
          <h1 className={`text-6xl md:text-7xl font-serif bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent mb-3`}>
            {personality.type}
          </h1>
          <p className="text-2xl font-serif text-amber-100/80">
            {personality.name}
          </p>
        </div>

        {/* 核心描述 */}
        <div className="card-mystical rounded-2xl p-8 mb-12">
          <p className="text-xl md:text-2xl text-amber-100/70 leading-relaxed text-center font-serif">
            {personality.description}
          </p>
        </div>

        {/* 六个维度 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* 性格特点 */}
          <div className={`card-mystical rounded-2xl p-6 bg-gradient-to-br ${colors.bg} to-black/30`}>
            <h3 className={`text-lg font-serif ${colors.text} mb-4 flex items-center gap-2`}>
              <span className="text-amber-400/60">✧</span>
              性格特点
            </h3>
            <div className="flex flex-wrap gap-2">
              {personality.traits.map((trait, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-xs text-amber-100/60 bg-white/5 rounded-full border border-white/10"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* 优势 */}
          <div className="card-mystical rounded-2xl p-6 bg-gradient-to-br from-emerald-900/20 to-black/30">
            <h3 className="text-lg font-serif text-emerald-300 mb-4 flex items-center gap-2">
              <span className="text-amber-400/60">◈</span>
              核心优势
            </h3>
            <ul className="space-y-2">
              {personality.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-amber-100/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 劣势 */}
          <div className="card-mystical rounded-2xl p-6 bg-gradient-to-br from-rose-900/20 to-black/30">
            <h3 className="text-lg font-serif text-rose-300 mb-4 flex items-center gap-2">
              <span className="text-amber-400/60">◆</span>
              成长空间
            </h3>
            <ul className="space-y-2">
              {personality.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2 text-amber-100/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 适合职业 */}
          <div className="card-mystical rounded-2xl p-6 bg-gradient-to-br from-blue-900/20 to-black/30">
            <h3 className="text-lg font-serif text-blue-300 mb-4 flex items-center gap-2">
              <span className="text-amber-400/60">✦</span>
              适合领域
            </h3>
            <div className="flex flex-wrap gap-2">
              {personality.careers.map((career, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-xs text-amber-100/60 bg-white/5 rounded-full border border-white/10"
                >
                  {career}
                </span>
              ))}
            </div>
          </div>

          {/* 人际关系 */}
          <div className="card-mystical rounded-2xl p-6 bg-gradient-to-br from-pink-900/20 to-black/30 md:col-span-2 lg:col-span-2">
            <h3 className="text-lg font-serif text-pink-300 mb-4 flex items-center gap-2">
              <span className="text-amber-400/60">◈</span>
              关系模式
            </h3>
            <p className="text-amber-100/70 leading-relaxed">
              {personality.relationships}
            </p>
          </div>
        </div>

        {/* 扩展信息 */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* 知名人物 */}
          <div className="card-mystical rounded-2xl p-8">
            <h3 className="text-lg font-serif text-amber-200 mb-4 flex items-center gap-2">
              <span className="text-amber-400/60">★</span>
              代表人物
            </h3>
            <p className="text-amber-100/60 text-sm leading-relaxed mb-4">
              {personality.type === 'ESTJ' && '乔治·华盛顿、弗兰克·辛纳屈、希拉里·克林顿、米歇尔·奥巴马'}
              {personality.type === 'ISTJ' && '乔治·华盛顿、娜塔莉·波特曼、安吉拉·默克尔'}
              {personality.type === 'ESFJ' && '泰勒·斯威夫特、珍妮弗·加纳、史蒂夫·哈维'}
              {personality.type === 'ISFJ' && '凯特·米德尔顿、罗莎·帕克斯、文森特·梵高'}
              {personality.type === 'ESTP' && '麦当娜、唐纳德·特朗普、埃尔维斯·普雷斯利'}
              {personality.type === 'ESFP' && '玛丽莲·梦露、杰米·福克斯、艾尔顿·约翰'}
              {personality.type === 'ISTP' && '克林特·伊斯特伍德、贝尔·格里尔斯、迈克尔·乔丹'}
              {personality.type === 'ISFP' && '鲍勃·迪伦、弗雷迪·默丘里、玛丽莲·梦露'}
              {personality.type === 'ENTJ' && '拿破仑、玛格丽特·撒切尔、比尔·盖茨'}
              {personality.type === 'INTJ' && '艾萨克·牛顿、弗里德里希·尼采、马克·扎克伯格'}
              {personality.type === 'ENFP' && '罗宾·威廉姆斯、小罗伯特·唐尼、威尔·史密斯'}
              {personality.type === 'INFP' && '威廉·莎士比亚、J.R.R.托尔金、戴安娜王妃'}
              {personality.type === 'ENFJ' && '马丁·路德·金、奥普拉·温弗瑞、约翰·列侬'}
              {personality.type === 'INFJ' && '马丁·路德·金、纳尔逊·曼德拉、柏拉图'}
              {personality.type === 'ENTP' && '托马斯·爱迪生、本杰明·富兰克林、罗伯特·唐尼'}
              {personality.type === 'INTP' && '阿尔伯特·爱因斯坦、查尔斯·达尔文、勒内·笛卡尔'}
            </p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-amber-100/40 leading-relaxed">
                <span className="text-amber-400/60 font-serif">说明：</span>
                代表人物基于心理学研究、传记分析和专家评估。历史人物为推测性分析，仅供参考。
              </p>
            </div>
          </div>

          {/* 人口比例 */}
          <div className="card-mystical rounded-2xl p-8">
            <h3 className="text-lg font-serif text-amber-200 mb-4 flex items-center gap-2">
              <span className="text-amber-400/60">◈</span>
              人口占比
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-amber-100/60 text-sm">全球占比</span>
                <span className="text-amber-200 font-serif">
                  {personality.type === 'ESTJ' && '8-12%'}
                  {personality.type === 'ISTJ' && '11-14%'}
                  {personality.type === 'ESFJ' && '9-13%'}
                  {personality.type === 'ISFJ' && '13-19%'}
                  {personality.type === 'ESTP' && '4-10%'}
                  {personality.type === 'ESFP' && '4-10%'}
                  {personality.type === 'ISTP' && '5-10%'}
                  {personality.type === 'ISFP' && '5-10%'}
                  {personality.type === 'ENTJ' && '2-5%'}
                  {personality.type === 'INTJ' && '2-4%'}
                  {personality.type === 'ENFP' && '6-8%'}
                  {personality.type === 'INFP' && '4-5%'}
                  {personality.type === 'ENFJ' && '2-5%'}
                  {personality.type === 'INFJ' && '1-3%'}
                  {personality.type === 'ENTP' && '2-5%'}
                  {personality.type === 'INTP' && '3-5%'}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${colors.gradient}`}
                  style={{ 
                    width: personality.type === 'ISFJ' ? '15%' :
                           personality.type === 'ISTJ' ? '12%' :
                           personality.type === 'ESFJ' ? '11%' :
                           personality.type === 'ESTJ' ? '10%' :
                           personality.type === 'ENFP' ? '7%' :
                           personality.type === 'ISTP' || personality.type === 'ISFP' || personality.type === 'ESTP' || personality.type === 'ESFP' ? '8%' :
                           personality.type === 'ENTJ' || personality.type === 'ENFJ' || personality.type === 'ENTP' || personality.type === 'INTP' ? '4%' :
                           personality.type === 'INTJ' ? '3%' :
                           personality.type === 'INFP' ? '4%' :
                           personality.type === 'INFJ' ? '2%' : '5%'
                  }}
                />
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-amber-100/40 leading-relaxed">
                  <span className="text-amber-400/60 font-serif">数据来源：</span>
                  MBTI® 官方手册、CPP 公司统计数据、Myers-Briggs 基金会研究。
                  占比为全球平均值估计，实际分布因地区、文化和性别而异。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
          <button
            onClick={() => router.push('/test')}
            className="flex-1 btn-mystical py-4 rounded-xl text-base font-serif tracking-wide"
          >
            重新探索
          </button>
          <Link
            href="/"
            className="flex-1 btn-outline-mystical py-4 rounded-xl text-base font-serif tracking-wide text-center"
          >
            返回星域
          </Link>
        </div>

        {/* 人格对比按钮 */}
        <div className="text-center">
          <button
            onClick={() => setShowCompare(true)}
            className="text-amber-100/60 hover:text-amber-200 text-sm font-serif flex items-center gap-2 mx-auto transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            对比其他人格类型
          </button>
        </div>
      </div>

      {/* 人格对比模态框 */}
      {showCompare && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setShowCompare(false)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-2xl card-mystical p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowCompare(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-serif text-amber-100 mb-6 text-center">人格类型对比</h2>

            {/* 选择对比类型 */}
            <div className="mb-8">
              <label className="block text-amber-100/60 text-sm mb-2">选择要对比的人格类型：</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {(['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'] as MBTIType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCompareType(t)}
                    className={`py-2 rounded-lg text-sm font-serif transition-all ${
                      compareType === t
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                        : 'bg-white/5 border-white/10 text-amber-100/60 hover:bg-white/10'
                    } border`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {compareType && compareType !== type && (
              <div className="space-y-6 animate-fade-in-up">
                {(() => {
                  const comparePersonality = getPersonalityByType(compareType);
                  if (!comparePersonality) return null;
                  const compareColors = typeColors[compareType] || typeColors.INTJ;

                  return (
                    <>
                      {/* 基本信息对比 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`card-mystical rounded-xl p-6 bg-gradient-to-br ${colors.bg} to-black/30`}>
                          <h3 className={`text-3xl font-serif ${colors.text} mb-2`}>{type}</h3>
                          <p className="text-amber-100/80 font-serif">{personality.name}</p>
                          <p className="text-amber-100/40 text-xs mt-1">{personality.nickname}</p>
                        </div>
                        <div className={`card-mystical rounded-xl p-6 bg-gradient-to-br ${compareColors.bg} to-black/30`}>
                          <h3 className={`text-3xl font-serif ${compareColors.text} mb-2`}>{compareType}</h3>
                          <p className="text-amber-100/80 font-serif">{comparePersonality.name}</p>
                          <p className="text-amber-100/40 text-xs mt-1">{comparePersonality.nickname}</p>
                        </div>
                      </div>

                      {/* 描述对比 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="card-mystical rounded-xl p-4">
                          <h4 className="text-amber-200 text-sm font-serif mb-2">核心特质</h4>
                          <p className="text-amber-100/60 text-sm leading-relaxed">{personality.description}</p>
                        </div>
                        <div className="card-mystical rounded-xl p-4">
                          <h4 className="text-amber-200 text-sm font-serif mb-2">核心特质</h4>
                          <p className="text-amber-100/60 text-sm leading-relaxed">{comparePersonality.description}</p>
                        </div>
                      </div>

                      {/* 优势对比 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="card-mystical rounded-xl p-4 bg-emerald-900/10 border-emerald-500/10">
                          <h4 className="text-emerald-300 text-sm font-serif mb-2">优势</h4>
                          <ul className="space-y-1">
                            {personality.strengths.slice(0, 4).map((s, i) => (
                              <li key={i} className="text-amber-100/60 text-xs flex items-start gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="card-mystical rounded-xl p-4 bg-emerald-900/10 border-emerald-500/10">
                          <h4 className="text-emerald-300 text-sm font-serif mb-2">优势</h4>
                          <ul className="space-y-1">
                            {comparePersonality.strengths.slice(0, 4).map((s, i) => (
                              <li key={i} className="text-amber-100/60 text-xs flex items-start gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 成长空间对比 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="card-mystical rounded-xl p-4 bg-rose-900/10 border-rose-500/10">
                          <h4 className="text-rose-300 text-sm font-serif mb-2">成长空间</h4>
                          <ul className="space-y-1">
                            {personality.weaknesses.slice(0, 4).map((w, i) => (
                              <li key={i} className="text-amber-100/60 text-xs flex items-start gap-1">
                                <span className="w-1 h-1 rounded-full bg-rose-400 mt-1 flex-shrink-0" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="card-mystical rounded-xl p-4 bg-rose-900/10 border-rose-500/10">
                          <h4 className="text-rose-300 text-sm font-serif mb-2">成长空间</h4>
                          <ul className="space-y-1">
                            {comparePersonality.weaknesses.slice(0, 4).map((w, i) => (
                              <li key={i} className="text-amber-100/60 text-xs flex items-start gap-1">
                                <span className="w-1 h-1 rounded-full bg-rose-400 mt-1 flex-shrink-0" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 差异分析 */}
                      <div className="card-mystical rounded-xl p-6 bg-gradient-to-br from-amber-900/10 to-black/30">
                        <h4 className="text-amber-200 text-sm font-serif mb-3 flex items-center gap-2">
                          <span className="text-amber-400/60">✦</span>
                          主要差异
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-amber-100/60">
                            <span className="text-amber-400/80 font-serif">{type.charAt(0)}</span>
                            <span>vs</span>
                            <span className={compareColors.text}>{compareType.charAt(0)}</span>
                            <span className="text-amber-100/40">
                              {type.charAt(0) === compareType.charAt(0) 
                                ? '→ 相同的能量来源'
                                : type.charAt(0) === 'E' 
                                  ? '→ 你更外向，Ta 更内向'
                                  : '→ 你更内向，Ta 更外向'
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-amber-100/60">
                            <span className="text-amber-400/80 font-serif">{type.charAt(1)}</span>
                            <span>vs</span>
                            <span className={compareColors.text}>{compareType.charAt(1)}</span>
                            <span className="text-amber-100/40">
                              {type.charAt(1) === compareType.charAt(1)
                                ? '→ 相同的信息获取方式'
                                : type.charAt(1) === 'S'
                                  ? '→ 你更注重实际，Ta 更注重直觉'
                                  : '→ 你更注重直觉，Ta 更注重实际'
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-amber-100/60">
                            <span className="text-amber-400/80 font-serif">{type.charAt(2)}</span>
                            <span>vs</span>
                            <span className={compareColors.text}>{compareType.charAt(2)}</span>
                            <span className="text-amber-100/40">
                              {type.charAt(2) === compareType.charAt(2)
                                ? '→ 相同的决策方式'
                                : type.charAt(2) === 'T'
                                  ? '→ 你更理性，Ta 更感性'
                                  : '→ 你更感性，Ta 更理性'
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-amber-100/60">
                            <span className="text-amber-400/80 font-serif">{type.charAt(3)}</span>
                            <span>vs</span>
                            <span className={compareColors.text}>{compareType.charAt(3)}</span>
                            <span className="text-amber-100/40">
                              {type.charAt(3) === compareType.charAt(3)
                                ? '→ 相同的生活方式'
                                : type.charAt(3) === 'J'
                                  ? '→ 你更有计划性，Ta 更随性'
                                  : '→ 你更随性，Ta 更有计划性'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {compareType === type && (
              <div className="text-center py-12">
                <p className="text-amber-100/60">请选择一个不同的人格类型进行对比</p>
              </div>
            )}

            {!compareType && (
              <div className="text-center py-12">
                <p className="text-amber-100/40">点击上方人格类型开始对比</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 图片预览模态框 */}
      {showImageModal && generatedImageUrl && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* 图片 */}
            <img 
              src={generatedImageUrl} 
              alt="MBTI 结果分享图"
              className="max-w-full max-h-[85vh] w-auto h-auto rounded-2xl object-contain"
            />
            
            {/* 操作按钮 */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              <a
                href={generatedImageUrl}
                download={`MBTI-${personality.type}-结果.png`}
                className="btn-mystical px-6 py-3 rounded-full text-sm font-serif tracking-wide flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载图片
              </a>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(generatedImageUrl);
                    const blob = await response.blob();
                    await navigator.clipboard.write([
                      new ClipboardItem({
                        'image/png': blob,
                      }),
                    ]);
                    alert('图片已复制到剪贴板！');
                  } catch (err) {
                    console.error('复制失败:', err);
                    alert('复制失败，请截图保存');
                  }
                }}
                className="btn-outline-mystical px-6 py-3 rounded-full text-sm font-serif tracking-wide flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                复制图片
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 用于生成图片的隐藏内容 */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
        <div 
          ref={shareContentRef}
          className="w-[600px] p-10"
          style={{ background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #0f0f1a 100%)' }}
        >
          {/* 头部 */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${colors.gradient} mb-4 shadow-2xl`}>
              <span className="text-4xl font-serif text-white">
                {personality.type.charAt(0)}
              </span>
            </div>
            <div className="mb-1">
              <span className={`text-[10px] tracking-[0.25em] uppercase ${colors.text}`}>
                {personality.nickname}
              </span>
            </div>
            <h1 className={`text-4xl font-serif bg-gradient-to-br ${colors.gradient} bg-clip-text text-transparent mb-1`}>
              {personality.type}
            </h1>
            <p className="text-lg font-serif text-amber-100/80 mb-3">
              {personality.name}
            </p>
          </div>
          
          {/* 核心描述 */}
          <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/5">
            <p className="text-base text-amber-100/70 leading-relaxed text-center font-serif">
              {personality.description}
            </p>
          </div>
          
          {/* 性格特点标签 */}
          <div className="mb-4">
            <h3 className="text-xs font-serif text-amber-200 mb-2 flex items-center gap-1">
              <span className="text-amber-400/60">✧</span>
              性格特点
            </h3>
            <div className="flex flex-wrap gap-1">
              {personality.traits.map((trait, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-[10px] text-amber-100/60 bg-white/5 rounded-full border border-white/10"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
          
          {/* 三列布局 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* 核心优势 */}
            <div className="bg-emerald-900/10 rounded-lg p-3 border border-emerald-500/10">
              <h3 className="text-[10px] font-serif text-emerald-300 mb-2 flex items-center gap-1">
                <span className="text-amber-400/60">◈</span>
                优势
              </h3>
              <ul className="space-y-1">
                {personality.strengths.slice(0, 3).map((strength, index) => (
                  <li key={index} className="text-[9px] text-amber-100/70 leading-tight">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block mr-1" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 成长空间 */}
            <div className="bg-rose-900/10 rounded-lg p-3 border border-rose-500/10">
              <h3 className="text-[10px] font-serif text-rose-300 mb-2 flex items-center gap-1">
                <span className="text-amber-400/60">◆</span>
                成长
              </h3>
              <ul className="space-y-1">
                {personality.weaknesses.slice(0, 3).map((weakness, index) => (
                  <li key={index} className="text-[9px] text-amber-100/70 leading-tight">
                    <span className="w-1 h-1 rounded-full bg-rose-400 inline-block mr-1" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 适合职业 */}
            <div className="bg-blue-900/10 rounded-lg p-3 border border-blue-500/10">
              <h3 className="text-[10px] font-serif text-blue-300 mb-2 flex items-center gap-1">
                <span className="text-amber-400/60">✦</span>
                职业
              </h3>
              <div className="flex flex-wrap gap-1">
                {personality.careers.slice(0, 4).map((career, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 text-[8px] text-amber-100/60 bg-white/5 rounded border border-white/10"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* 人际关系 */}
          <div className="bg-pink-900/10 rounded-lg p-3 mb-4 border border-pink-500/10">
            <h3 className="text-[10px] font-serif text-pink-300 mb-1 flex items-center gap-1">
              <span className="text-amber-400/60">◈</span>
              关系模式
            </h3>
            <p className="text-[9px] text-amber-100/70 leading-relaxed">
              {personality.relationships}
            </p>
          </div>
          
          {/* 人口占比和代表人物 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 rounded-lg p-2 border border-white/5">
              <h3 className="text-[10px] font-serif text-amber-200 mb-1">人口占比</h3>
              <p className="text-xs font-serif text-amber-300">
                {personality.type === 'ISFJ' && '13-19% (最常见)'}
                {personality.type === 'ISTJ' && '11-14%'}
                {personality.type === 'ESFJ' && '9-13%'}
                {personality.type === 'ESTJ' && '8-12%'}
                {personality.type === 'ENFP' && '6-8%'}
                {personality.type === 'ISTP' && '5-10%'}
                {personality.type === 'ISFP' && '5-10%'}
                {personality.type === 'ESTP' && '4-10%'}
                {personality.type === 'ESFP' && '4-10%'}
                {personality.type === 'INFP' && '4-5%'}
                {personality.type === 'ENTJ' && '2-5%'}
                {personality.type === 'ENFJ' && '2-5%'}
                {personality.type === 'ENTP' && '2-5%'}
                {personality.type === 'INTP' && '3-5%'}
                {personality.type === 'INTJ' && '2-4%'}
                {personality.type === 'INFJ' && '1-3% (最稀有)'}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 border border-white/5">
              <h3 className="text-[10px] font-serif text-amber-200 mb-1">代表人物</h3>
              <p className="text-[9px] text-amber-100/60 leading-tight">
                {personality.type === 'ESTJ' && '华盛顿、撒切尔'}
                {personality.type === 'ISTJ' && '默克尔、华盛顿'}
                {personality.type === 'ESFJ' && '泰勒·斯威夫特'}
                {personality.type === 'ISFJ' && '凯特王妃、梵高'}
                {personality.type === 'ESTP' && '麦当娜、特朗普'}
                {personality.type === 'ESFP' && '梦露、艾尔顿·约翰'}
                {personality.type === 'ISTP' && '乔丹、伊斯特伍德'}
                {personality.type === 'ISFP' && '迪伦、默丘里'}
                {personality.type === 'ENTJ' && '拿破仑、盖茨'}
                {personality.type === 'INTJ' && '牛顿、扎克伯格'}
                {personality.type === 'ENFP' && '小罗伯特·唐尼'}
                {personality.type === 'INFP' && '莎士比亚、托尔金'}
                {personality.type === 'ENFJ' && '马丁·路德·金'}
                {personality.type === 'INFJ' && '曼德拉、柏拉图'}
                {personality.type === 'ENTP' && '爱迪生、富兰克林'}
                {personality.type === 'INTP' && '爱因斯坦、达尔文'}
              </p>
            </div>
          </div>
          
          {/* 底部 */}
          <div className="text-center pt-3 border-t border-white/10">
            <p className="text-[9px] text-amber-100/40 tracking-wider">人格星辰 · MBTI 人格分析测试</p>
          </div>
        </div>
      </div>
    </div>
  );
}
