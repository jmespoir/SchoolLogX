import React, { useState, useRef, useEffect } from 'react';
import type { HobbyPost } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Heart,
  Eye,
  MessageSquare,
  Play,
  Image as ImageIcon,
  Send,
  Sparkles
} from 'lucide-react';

interface Props {
  post: HobbyPost;
  onClose: () => void;
}

export const HobbyDetailModal: React.FC<Props> = ({ post, onClose }) => {
  const { hasLikedPost, toggleLikePost, addComment } = useApp();
  const [commentInput, setCommentInput] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive Canvas Demo Animation
  useEffect(() => {
    if (!isDemoMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; color: string }> = [];

    const colors = ['#38bdf8', '#818cf8', '#c084fc', '#f43f5e', '#34d399'];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDemoMode]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
  };

  const slides = [
    {
      bg: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900',
      tag: 'Artwork Cut 1',
      text: '디지털 일러스트 메인 렌더링 샷'
    },
    {
      bg: 'bg-gradient-to-br from-cyan-950 via-blue-900 to-slate-900',
      tag: 'Draft Sketch 2',
      text: '러프 스케치 및 채색 레이어 분할'
    },
    {
      bg: 'bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950',
      tag: 'Color Palette 3',
      text: '네온 사이버펑크 앰비언트 텍스처'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0f1424] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#13182b]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {post.no}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {post.category}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white m-0">
              {post.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Grid: Left Viewer & Right Content (Wireframe P.5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: Interactive Web Demo / Slide Gallery */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col gap-4 bg-[#0a0d17]">
            {/* Mode Switch Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isDemoMode
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {isDemoMode ? <ImageIcon className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isDemoMode ? '대표 썸네일 갤러리로 전환' : '클릭 시 인터랙티브 웹 데모로 전환'}
              </button>
              <span className="text-xs text-slate-500">
                {isDemoMode ? '🎮 실시간 파티클 캔버스 구동 중' : '🖼️ 슬라이드 갤러리 지원'}
              </span>
            </div>

            {/* Display Area */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-[#0d1222] flex items-center justify-center">
              {isDemoMode ? (
                <div className="w-full h-full relative flex flex-col items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={360}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    인터랙티브 파티클 데모 활성화
                  </div>
                </div>
              ) : (
                <div className={`w-full h-full ${slides[currentSlideIndex].bg} flex flex-col items-center justify-center p-6 text-center transition-all duration-300`}>
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-3xl mb-3 shadow-inner">
                    🎨
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30 mb-2">
                    {slides[currentSlideIndex].tag}
                  </span>
                  <p className="text-sm font-medium text-slate-200">
                    {slides[currentSlideIndex].text}
                  </p>
                </div>
              )}
            </div>

            {/* Slide Navigation Dots (Gallery Mode) */}
            {!isDemoMode && (
              <div className="flex items-center justify-center gap-2 pt-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlideIndex === idx
                        ? 'w-6 bg-cyan-400'
                        : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Author Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-base">
                  👨‍🎨
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {post.authorGamerTag}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    등록일: {post.createdAt}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {post.views}
                </span>
                <span className="flex items-center gap-1 text-pink-400">
                  <Heart className="w-3.5 h-3.5 fill-pink-500/20 text-pink-400" />
                  {post.likes}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Post Body & Comments */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-[#0f1424]">
            <div className="space-y-5">
              {/* Post Title & Group Badge */}
              <div className="space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold">
                  그룹 게시글
                </div>
                <h3 className="text-2xl font-black text-white m-0">
                  {post.title}
                </h3>
                <p className="text-base font-semibold text-cyan-300">
                  "{post.subtitle}"
                </p>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                {post.description}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Reaction Section (Wireframe P.5: 🎁 이 게시글 어떠신가요?) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                    <span>🎁</span> 이 게시글 어떠신가요?
                  </div>
                  <button
                    onClick={() => toggleLikePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all hover:scale-105 ${
                      hasLikedPost(post.id)
                        ? 'bg-pink-500 text-white border-pink-400 shadow-md shadow-pink-500/30'
                        : 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border-pink-500/40'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        hasLikedPost(post.id)
                          ? 'fill-white text-white'
                          : 'fill-pink-400 text-pink-400'
                      }`}
                    />
                    {hasLikedPost(post.id) ? '추천 완료' : '추천하기'} ({post.likes})
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  {hasLikedPost(post.id)
                    ? '✓ 회원님의 추천이 반영되었습니다. (1인 1회 추천)'
                    : '한 사람당 1회만 추천할 수 있습니다. 따뜻한 피드백을 남겨보세요!'}
                </p>
              </div>

              {/* Comments Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  댓글 목록 ({post.comments.length})
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {post.comments.length === 0 ? (
                    <div className="text-xs text-slate-500 italic p-3 text-center bg-slate-900/40 rounded-lg">
                      첫 번째 댓글의 주인공이 되어보세요!
                    </div>
                  ) : (
                    post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">
                            {comment.author}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-300 m-0 leading-normal">
                          {comment.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSendComment} className="pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="댓글 입력하기 (건전한 댓글을 작성해 주세요)..."
                  className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
