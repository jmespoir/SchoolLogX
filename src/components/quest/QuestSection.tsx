import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { QuestParty } from '../../types';
import {
  Users,
  MapPin,
  Crown,
  UserPlus,
  UserMinus,
  Plus,
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  X,
  Tag,
  Laptop,
  Palette,
  Trophy,
  Coffee,
  BookOpen,
  Compass,
  AlertCircle
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', name: '전체', icon: Compass },
  { id: 'IT & 코딩', name: 'IT & 코딩', icon: Laptop },
  { id: '예술', name: '예술', icon: Palette },
  { id: '스포츠', name: '스포츠', icon: Trophy },
  { id: '라이프 스타일', name: '라이프 스타일', icon: Coffee },
  { id: '문학', name: '문학', icon: BookOpen }
];

export const QuestSection: React.FC = () => {
  const {
    quests,
    joinQuest,
    leaveQuest,
    addQuest,
    user,
    setTab,
    selectedQuestCategory,
    setSelectedQuestCategory,
    selectedQuest,
    setSelectedQuest
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>(
    selectedQuestCategory || 'all'
  );
  const [detailQuest, setDetailQuest] = useState<QuestParty | null>(selectedQuest);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Quest Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('IT & 코딩');
  const [newLocation, setNewLocation] = useState('');
  const [newMaxCount, setNewMaxCount] = useState(5);
  const [newDescription, setNewDescription] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [newActivityPlan, setNewActivityPlan] = useState('');
  const [newTags, setNewTags] = useState('');
  const [formError, setFormError] = useState('');

  const handleCategoryChange = (catName: string) => {
    setActiveCategory(catName);
    setSelectedQuestCategory(catName === 'all' ? null : catName);
  };

  const filteredQuests =
    activeCategory === 'all'
      ? quests
      : quests.filter((q) => q.category === activeCategory);

  // Handle open detail
  const handleOpenDetail = (questItem: QuestParty) => {
    setDetailQuest(questItem);
    setSelectedQuest(questItem);
  };

  // Keep detailQuest synced with quests state
  const currentDetailQuest = detailQuest
    ? quests.find((q) => q.id === detailQuest.id) || detailQuest
    : null;

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim() || !newDescription.trim()) {
      setFormError('필수 입력 항목(제목, 장소/일정, 소개)을 작성해주세요.');
      return;
    }

    const tagList = newTags
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    addQuest({
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim(),
      locationAndTime: newLocation.trim(),
      maxCount: newMaxCount,
      dDay: 'D-7',
      leader: `${user.realName}(파티장)`,
      tags: tagList.length > 0 ? tagList : ['#소모임', `#${newCategory}`],
      requirements: newRequirements.trim() || '열정 있는 학우 누구나 환영',
      activityPlan: newActivityPlan.trim() || '1주차 오리엔테이션 및 정기 모임 시작',
      icon:
        newCategory === 'IT & 코딩'
          ? '💻'
          : newCategory === '예술'
          ? '🎨'
          : newCategory === '스포츠'
          ? '⚽'
          : newCategory === '문학'
          ? '📚'
          : '☕'
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewLocation('');
    setNewDescription('');
    setNewRequirements('');
    setNewActivityPlan('');
    setNewTags('');
    setFormError('');
  };

  return (
    <div className="space-y-6 py-4">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setTab('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/80 transition-all hover:-translate-x-0.5"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>메인 허브로 돌아가기</span>
        </button>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>새 소모임 퀘스트 개설</span>
        </button>
      </div>

      {/* Title Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>취미 공유 소모임 파티 아레나</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white m-0 mt-1">
          카테고리별 퀘스트 모임 탐색 & 실시간 파티 슬롯
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          취미 게시판처럼 카테고리별로 모임을 살펴보고, '참여' 버튼을 눌러 상세 요강을 확인하고 파티 슬롯에 등록하세요!
        </p>
      </div>

      {/* Category Filter Pills (Like Hobby Board) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.name;
          const count =
            tab.id === 'all'
              ? quests.length
              : quests.filter((q) => q.category === tab.name).length;

          return (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quests Grid */}
      {filteredQuests.length === 0 ? (
        <div className="text-center py-16 bg-[#111628]/60 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl">
            🔍
          </div>
          <h3 className="text-base font-bold text-white">해당 카테고리의 소모임이 아직 없습니다</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            가장 먼저 이 카테고리의 퀘스트 파티를 개설하여 새로운 팀원을 모집해보세요!
          </p>
          <button
            onClick={() => {
              setNewCategory(activeCategory === '전체' ? 'IT & 코딩' : activeCategory);
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/30 transition-all mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>이 카테고리로 퀘스트 만들기</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuests.map((questItem) => {
            const isUserJoined = questItem.members.includes(user.realName);
            const isFull = questItem.currentCount >= questItem.maxCount;
            const progress = Math.min(
              100,
              Math.round((questItem.currentCount / questItem.maxCount) * 100)
            );

            return (
              <div
                key={questItem.id}
                className={`group relative bg-[#111628] hover:bg-[#151c34] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                  isUserJoined
                    ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800/80 hover:border-indigo-500/50'
                }`}
              >
                {/* Top Badges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {questItem.category}
                      </span>
                      <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {questItem.dDay}
                      </span>
                    </div>

                    {isUserJoined ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                        참가중
                      </span>
                    ) : isFull ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        정원 마감
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        모집중
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-1 flex items-center gap-1.5">
                      {questItem.icon && <span>{questItem.icon}</span>}
                      <span>{questItem.title}</span>
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {questItem.description}
                    </p>
                  </div>

                  {/* Location & Leader Info */}
                  <div className="space-y-1.5 py-2 border-y border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{questItem.locationAndTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-300 truncate font-semibold">
                        {questItem.leader}
                      </span>
                    </div>
                  </div>

                  {/* Party Slot Counter & Neon Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-400">파티 슬롯 현황</span>
                      <span className="text-cyan-400 font-mono font-black">
                        {questItem.currentCount} / {questItem.maxCount} 명
                      </span>
                    </div>
                    <div className="relative w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>진행률 {progress}%</span>
                      <span>
                        {isFull
                          ? '정원 마감'
                          : `잔여 ${questItem.maxCount - questItem.currentCount}자리`}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {questItem.tags && questItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {questItem.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Button: 참여 및 상세보기 */}
                <div className="pt-4 mt-2">
                  <button
                    onClick={() => handleOpenDetail(questItem)}
                    className={`w-full py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
                      isUserJoined
                        ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                        : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{isUserJoined ? '참여 현황 및 상세 정보' : '참여 및 상세 정보'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quest Detail Modal (참여 버튼을 눌렀을 때 모임에 관한 상세한 내용 모달) */}
      {currentDetailQuest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#111628] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setDetailQuest(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {currentDetailQuest.category}
                </span>
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                  마감 {currentDetailQuest.dDay}
                </span>
                {currentDetailQuest.members.includes(user.realName) ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    현재 파티 참여중
                  </span>
                ) : currentDetailQuest.currentCount >= currentDetailQuest.maxCount ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    정원 마감
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    파티원 모집중
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                {currentDetailQuest.icon && <span>{currentDetailQuest.icon}</span>}
                <span>{currentDetailQuest.title}</span>
              </h2>
            </div>

            {/* Host & Meeting Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>파티장(개설자)</span>
                </div>
                <div className="text-white font-bold text-sm">
                  {currentDetailQuest.leader}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>활동 장소 및 정기 시간</span>
                </div>
                <div className="text-white font-bold text-sm truncate">
                  {currentDetailQuest.locationAndTime}
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                모임 소개 및 목표
              </h4>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {currentDetailQuest.description}
              </div>
            </div>

            {/* Requirements & Activity Plan */}
            <div className="space-y-3">
              {currentDetailQuest.requirements && (
                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>참가 자격 및 준비물</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {currentDetailQuest.requirements}
                  </p>
                </div>
              )}

              {currentDetailQuest.activityPlan && (
                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1">
                  <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>주요 활동 계획</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {currentDetailQuest.activityPlan}
                  </p>
                </div>
              )}
            </div>

            {/* Party Slots Visualization */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-slate-200">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>실시간 파티 슬롯 현황</span>
                </div>
                <span className="text-cyan-400 font-mono font-black text-sm">
                  {currentDetailQuest.currentCount} / {currentDetailQuest.maxCount} 명
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (currentDetailQuest.currentCount / currentDetailQuest.maxCount) * 100
                      )
                    )}%`
                  }}
                />
              </div>

              {/* Slots Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {/* Leader Slot */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentDetailQuest.leader}</span>
                </div>

                {/* Registered Members */}
                {currentDetailQuest.members.map((member, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      member === user.realName
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 ring-1 ring-cyan-400/30'
                        : 'bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        member === user.realName ? 'bg-cyan-400' : 'bg-slate-400'
                      }`}
                    />
                    <span>{member}</span>
                    {member === user.realName && (
                      <span className="text-[10px] bg-cyan-500/30 text-cyan-200 px-1 rounded">나</span>
                    )}
                  </div>
                ))}

                {/* Empty Remaining Slots */}
                {Array.from({
                  length: Math.max(
                    0,
                    currentDetailQuest.maxCount - 1 - currentDetailQuest.members.length
                  )
                }).map((_, i) => (
                  <div
                    key={`slot-empty-${i}`}
                    className="px-3 py-1.5 rounded-xl border border-dashed border-slate-800 text-slate-600 text-xs font-semibold"
                  >
                    빈 슬롯 #{i + currentDetailQuest.members.length + 2}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              {currentDetailQuest.members.includes(user.realName) ? (
                <button
                  onClick={() => leaveQuest(currentDetailQuest.id)}
                  className="w-full py-3.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <UserMinus className="w-4 h-4" />
                  <span>퀘스트 파티 참가 취소하기</span>
                </button>
              ) : (
                <button
                  onClick={() => joinQuest(currentDetailQuest.id)}
                  disabled={currentDetailQuest.currentCount >= currentDetailQuest.maxCount}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>
                    {currentDetailQuest.currentCount >= currentDetailQuest.maxCount
                      ? '정원이 마감되어 참여할 수 없습니다'
                      : '지금 파티 참가하기 (슬롯 등록)'}
                  </span>
                </button>
              )}
              <p className="text-[11px] text-slate-500 text-center">
                참가 완료 시 실시간 파티 슬롯에 이름이 등록되며, 내 프로필 활동 내역과 연동됩니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create New Quest Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#111628] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                새 퀘스트 개설
              </div>
              <h2 className="text-2xl font-black text-white m-0">
                소모임 퀘스트 파티 모집하기
              </h2>
              <p className="text-xs text-slate-400">
                원하는 취미나 스터디 주제로 파티원을 모집해보세요.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateQuest} className="space-y-4 text-xs">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  카테고리 선택 *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {['IT & 코딩', '예술', '스포츠', '라이프 스타일', '문학'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`py-2 px-2.5 rounded-xl font-bold text-[11px] border transition-all text-center truncate ${
                        newCategory === cat
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  모집 제목 *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 3D 모델링 블렌더 스터디 크루 모집"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Location & Time */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  활동 장소 및 시간 *
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="예: 멀티미디어실 102호 / 매주 화,목 점심시간"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Max Members Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    모집 정원: <span className="text-cyan-400 font-mono">{newMaxCount}명</span>
                  </label>
                  <span className="text-[11px] text-slate-500">최대 12명</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={newMaxCount}
                  onChange={(e) => setNewMaxCount(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  모임 소개 & 활동 내용 *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="모임의 목적과 어떤 분들과 함께하고 싶은지 적어주세요."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  참가 자격 및 준비물 (선택)
                </label>
                <input
                  type="text"
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  placeholder="예: 개인 노트북 지참, 기본 관심사만 있으면 누구나 환영"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  해시태그 (선택)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="예: #스터디 #친목 #취미공유"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>소모임 퀘스트 등록 완료</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
