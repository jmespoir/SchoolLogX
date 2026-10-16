import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import { HobbyDetailModal } from './HobbyDetailModal';
import { SceneTransitionFlash } from '../effects/SceneTransitionFlash';
import {
  Flame,
  Sparkles,
  ArrowUpRight,
  Plus,
  Eye,
  Heart,
  Palette,
  Trophy,
  BookOpen,
  Gamepad2,
  ArrowLeft,
  ChevronRight,
  Layers,
  Zap
} from 'lucide-react';

export const HobbyView: React.FC = () => {
  const {
    posts,
    selectedCategory,
    setSelectedCategory,
    selectedPost,
    setSelectedPost,
    addPost,
    user,
    setTab,
    hasLikedPost,
    triggerConfetti
  } = useApp();

  // Scene state: 'categories' (Category Hub) | 'board' (Dedicated Board Feed)
  const [currentScene, setCurrentScene] = useState<'categories' | 'board'>(() => {
    return selectedCategory ? 'board' : 'categories';
  });

  const [transitionKey, setTransitionKey] = useState<string | null>(null);
  const [transitionLabel, setTransitionLabel] = useState<string>('');

  const [sortOrder, setSortOrder] = useState<'hot' | 'recent'>('hot');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New post form state
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState('예술');
  const [formDescription, setFormDescription] = useState('');
  const [formMaxMembers, setFormMaxMembers] = useState<number>(4);

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Palette':
        return <Palette className="w-5 h-5" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  // Handle Scene Transition when clicking "게시판 입장하기"
  const handleEnterCategoryBoard = (catName: string) => {
    setSelectedCategory(catName);
    setTransitionLabel(`${catName} 게시판`);
    setTransitionKey(`warp-${catName}-${Date.now()}`);
    triggerConfetti();

    // Scene transition
    setTimeout(() => {
      setCurrentScene('board');
    }, 120);
  };

  // Handle Back to Categories Hub
  const handleBackToCategories = () => {
    setTransitionLabel('카테고리 전체 목록');
    setTransitionKey(`warp-back-${Date.now()}`);
    setTimeout(() => {
      setCurrentScene('categories');
      setSelectedCategory(null);
    }, 120);
  };

  // Filtered & sorted posts for board view
  const activeCategoryName = selectedCategory || '예술';
  const filteredPosts = posts
    .filter((p) => (selectedCategory ? p.category === selectedCategory : true))
    .sort((a, b) => {
      if (sortOrder === 'hot') {
        return b.likes + b.views - (a.likes + a.views);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });

  const activeCategoryInfo =
    INITIAL_CATEGORIES.find((c) => c.name === activeCategoryName) ||
    INITIAL_CATEGORIES[0];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    addPost({
      no: `NO.0${posts.length + 1}`,
      title: formTitle,
      subtitle: formSubtitle || '새로운 취미를 공유합니다',
      category: formCategory,
      author: user.realName,
      authorTag: user.gamerTag.slice(0, 3).toLowerCase(),
      authorGamerTag: `${user.gamerTag} · ${user.realName}`,
      description: formDescription,
      currentMembers: 1,
      maxMembers: formMaxMembers,
      tags: [`#${formCategory}`, '#새프로젝트', '#함께해요']
    });

    setFormTitle('');
    setFormSubtitle('');
    setFormDescription('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-8 py-4 relative">
      {/* High-Impact Warp Transition Overlay */}
      <SceneTransitionFlash triggerKey={transitionKey} label={transitionLabel} />

      {/* Top Global Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('home')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/80 transition-all hover:-translate-x-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>메인 허브</span>
          </button>

          {currentScene === 'board' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <button
                onClick={handleBackToCategories}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-500/40 transition-all hover:scale-105"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>카테고리 목록으로 돌아가기</span>
              </button>
            </>
          )}
        </div>

        {/* Scene Indicator Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono font-bold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {currentScene === 'categories' ? 'SCENE: 카테고리 허브' : `SCENE: [${selectedCategory}] 전용 게시판`}
        </div>
      </div>

      {/* ========================================================
          SCENE 1: 카테고리 주화면 (카테고리 카드 4개 허브)
         ======================================================== */}
      {currentScene === 'categories' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              동아리 & 취미 전시관
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white m-0">
              취미 카테고리 선택
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              관심 있는 카테고리의 <strong>'게시판 입장하기'</strong>를 클릭하면 해당 게시판으로 화면이 전환됩니다.
            </p>
          </div>

          {/* 4 Category Cards (Wireframe P.2) with High-Impact Hover & Click */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
            {INITIAL_CATEGORIES.slice(0, 4).map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleEnterCategoryBoard(cat.name)}
                className="group relative bg-[#111628] hover:bg-[#151c33] border border-slate-800/90 hover:border-cyan-400/80 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] ring-0 hover:ring-2 hover:ring-cyan-400/30 overflow-hidden"
              >
                {/* Ambient glow corner */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-400/25 transition-all duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60 group-hover:border-cyan-500/40 transition-colors">
                      게시글 수 {cat.postCount}
                    </span>
                    <div className="text-slate-400 group-hover:text-cyan-300 group-hover:scale-125 transition-all duration-200">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-1 mb-6">
                    {cat.tagline}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-800/80">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      🔥 최다 인기 게시물
                    </span>
                    <p className="text-xs text-slate-300 font-medium truncate">
                      {cat.topPostTitle}
                    </p>
                  </div>

                  {/* Action Button: 게시판 입장하기 */}
                  <div className="w-full py-2.5 px-3 rounded-xl bg-slate-800/90 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-indigo-600 text-slate-300 group-hover:text-white flex items-center justify-between text-xs font-bold transition-all duration-200 shadow-sm group-hover:shadow-md group-hover:shadow-cyan-500/25">
                    <span>게시판 입장하기</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              원하는 카테고리 카드를 클릭하면 네온 워프 효과와 함께 전용 피드로 진입합니다.
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          SCENE 2: 카테고리 상세 게시판 (피드 & 정렬 & 글 작성)
         ======================================================== */}
      {currentScene === 'board' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Dedicated Category Header Banner */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-[#111628] border border-cyan-500/30 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold">
                  {getCategoryIcon(activeCategoryInfo.iconName)}
                  <span>{activeCategoryInfo.name} 카테고리 전용관</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white m-0">
                  {activeCategoryInfo.name} 게시판
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm font-medium">
                  "{activeCategoryInfo.tagline}" · 학우들과 함께 만들어가는 취미 공간
                </p>
              </div>

              {/* Category Quick Switcher Pills */}
              <div className="flex items-center gap-1.5 flex-wrap bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                {INITIAL_CATEGORIES.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleEnterCategoryBoard(c.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === c.name
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sub Header: Sort Filters & Write Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white m-0">
                게시글 피드 ({filteredPosts.length})
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Buttons */}
              <div className="flex items-center gap-1 bg-[#13182b] p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setSortOrder('hot')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sortOrder === 'hot'
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  인기순
                </button>
                <button
                  onClick={() => setSortOrder('recent')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sortOrder === 'recent'
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  최신순
                </button>
              </div>

              {/* Write Button */}
              <button
                onClick={() => {
                  setFormCategory(selectedCategory || '예술');
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                작품/모집 등록
              </button>
            </div>
          </div>

          {/* Post Grid (Wireframe P.3 Cards) */}
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-500">
              <p className="text-sm font-bold">아직 등록된 게시물이 없습니다.</p>
              <button
                onClick={() => {
                  setFormCategory(selectedCategory || '예술');
                  setIsCreateModalOpen(true);
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
              >
                첫 게시글 작성하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map((post) => {
                const hasSlot =
                  post.maxMembers !== undefined && post.currentMembers !== undefined;
                const slotPercent = hasSlot
                  ? Math.min(100, Math.round((post.currentMembers! / post.maxMembers!) * 100))
                  : 0;
                const isLiked = hasLikedPost(post.id);

                return (
                  <div
                    key={post.id}
                    className="group bg-[#111628] border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)]"
                  >
                    <div className="space-y-4">
                      {/* Top Thumbnail Box */}
                      <div className="w-full aspect-[16/10] rounded-xl bg-[#090d18] border border-slate-800/80 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-500/40 transition-colors">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {post.id === 'post-01' ? '🎧' : post.id === 'post-02' ? '🎤' : '🎨'}
                        </div>
                        <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-indigo-300 border border-indigo-500/30">
                          {post.no}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h4 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors m-0">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {post.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Status & Info */}
                    <div className="pt-5 space-y-3">
                      {hasSlot ? (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                            <span>참여자 수</span>
                            <span className="text-cyan-400 font-bold">
                              {post.currentMembers} / {post.maxMembers} (정원)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all"
                              style={{ width: `${slotPercent}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold py-1">
                          <span className={`flex items-center gap-1 ${isLiked ? 'text-pink-400 font-bold' : ''}`}>
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-400 text-pink-400' : 'text-pink-400'}`} />
                            추천 {post.likes}
                          </span>
                          <span>/</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            조회수 {post.views}
                          </span>
                        </div>
                      )}

                      {/* Author tag & Action Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          <span>{post.authorGamerTag}</span>
                        </div>
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-cyan-300 transition-colors group-hover:underline"
                        >
                          <span>상세보기</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          CREATE POST MODAL
         ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0f1424] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white m-0">
                새 취미 전시 및 모집글 작성
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  모집 / 작품 제목
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: 3D 모델링 스터디원 구함"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  서브 슬로건 (한줄 요약)
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="예: 블렌더 기초부터 차근차근!"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    카테고리
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="예술">예술</option>
                    <option value="스포츠">스포츠</option>
                    <option value="문학">문학</option>
                    <option value="라이프 스타일">라이프 스타일</option>
                    <option value="IT & 게임">IT & 게임</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    모집 정원 (명)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={formMaxMembers}
                    onChange={(e) => setFormMaxMembers(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  상세 설명 및 계획
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="활동 내용이나 준비물을 작성해 주세요..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  게시글 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL (Wireframe P.5) */}
      {selectedPost && (
        <HobbyDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};
