import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { VoteTopic } from '../../types';
import {
  Flame,
  Clock,
  Zap,
  CheckCircle2,
  Users,
  ChevronRight,
  ArrowLeft,
  Edit3,
  Plus,
  Sparkles,
  X,
  SlidersHorizontal,
  Check
} from 'lucide-react';

const PRESETS = [
  {
    category: 'e스포츠',
    title: '가을 축제 E-Sports 메인 종목 선정',
    opt1: '발로란트 (5인 1팀 교내 대항전)',
    opt2: '리그 오브 레전드 (소환사의 협곡)'
  },
  {
    category: '급식/복지',
    title: '금요일 점심 급식 자율 선택제 도입 건',
    opt1: '샐러드 & 덮밥 자율 선택 코너 운영',
    opt2: '기존 단일 정규 식단 배식 유지'
  },
  {
    category: '학습/자습',
    title: '중간고사 기간 도서관 24시간 자율 개방안',
    opt1: '찬성 (시험 2주 전부터 심야 개방)',
    opt2: '반대 (자정 마감 유지 및 안전 우선)'
  },
  {
    category: '체육/동아리',
    title: '방과후 체육관 우선 배정 종목 선호도',
    opt1: '풋살 & 농구 구기 리그전',
    opt2: '배드민턴 & 피구 자유 매치'
  },
  {
    category: '교칙/자치',
    title: '동복 기간 생활복/체육복 자율 착용 허용안',
    opt1: '1안: 생활복 상시 자율 착용 허용',
    opt2: '2안: 기존 정규 교복 규정 유지'
  }
];

export const VoteArena: React.FC = () => {
  const {
    votes,
    selectedVote,
    setSelectedVoteId,
    castVote,
    updateVoteTopic,
    createVoteTopic,
    setTab
  } = useApp();

  const [activeTopicId, setActiveTopicId] = useState<string>(selectedVote.id);
  const [voteToast, setVoteToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  // Edit Option Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editOpt1, setEditOpt1] = useState('');
  const [editOpt2, setEditOpt2] = useState('');

  // Create New Topic Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');
  const [newDeadline, setNewDeadline] = useState('D-7 남음');

  const currentTopic = votes.find((v) => v.id === activeTopicId) || votes[0] || selectedVote;

  const opt1 = currentTopic.options[0];
  const opt2 = currentTopic.options[1];
  const totalVotes = opt1.votes + opt2.votes;

  const percent1 = totalVotes === 0 ? 50 : Math.round((opt1.votes / totalVotes) * 100);
  const percent2 = 100 - percent1;

  // Clean formatted labels (removes redundant '선지 1: ' prefix if present)
  const cleanOpt1 = opt1.name.replace(/^선지\s*\d+:\s*/, '');
  const cleanOpt2 = opt2.name.replace(/^선지\s*\d+:\s*/, '');

  const handleSelectTopic = (topic: VoteTopic) => {
    setActiveTopicId(topic.id);
    setSelectedVoteId(topic.id);
    setVoteToast(null);
  };

  const handleVoteClick = (optionId: string) => {
    const success = castVote(currentTopic.id, optionId);
    if (!success) {
      setVoteToast({
        message: '이미 투표에 참여하신 안건입니다. (1인 1회 투표 제한)',
        type: 'warning'
      });
    } else {
      setVoteToast({
        message: '투표가 성공적으로 반영되었습니다!',
        type: 'success'
      });
    }

    setTimeout(() => {
      setVoteToast(null);
    }, 3500);
  };

  // Open Edit Modal with current values
  const handleOpenEditModal = () => {
    setEditTitle(currentTopic.title);
    setEditOpt1(cleanOpt1);
    setEditOpt2(cleanOpt2);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOpt1.trim() || !editOpt2.trim()) return;

    updateVoteTopic(
      currentTopic.id,
      editTitle.trim() || currentTopic.title,
      editOpt1.trim(),
      editOpt2.trim()
    );
    setIsEditModalOpen(false);
    setVoteToast({
      message: '선택지 문구가 투표 목적에 맞게 성공적으로 변경되었습니다!',
      type: 'success'
    });
    setTimeout(() => setVoteToast(null), 3000);
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setEditTitle(preset.title);
    setEditOpt1(preset.opt1);
    setEditOpt2(preset.opt2);
  };

  const handleCreateNewTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOpt1.trim() || !newOpt2.trim()) return;

    createVoteTopic(newTitle.trim(), newOpt1.trim(), newOpt2.trim(), newDeadline);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewOpt1('');
    setNewOpt2('');
    setVoteToast({
      message: '새 자치 투표 안건이 성공적으로 등록되었습니다!',
      type: 'success'
    });
    setTimeout(() => setVoteToast(null), 3000);
  };

  return (
    <div className="space-y-6 py-4 max-w-5xl mx-auto">
      {/* Back to Home Button & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setTab('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/80 transition-all hover:-translate-x-0.5"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>메인 허브로 돌아가기</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEditModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all hover:scale-105"
            title="현재 안건의 선택지 목적 및 문구를 자유롭게 변경합니다"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>선택지 목적/문구 변경</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-rose-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 투표 안건 개설</span>
          </button>
        </div>
      </div>

      {/* Title Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>학생 자치 투표 아레나</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white m-0 mt-1">
          실시간 참여형 학생 자치 투표 아레나
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          단순한 찬반을 넘어 e스포츠 종목 선정, 급식 선호도, 자치 규칙 등 투표 목적에 맞춰 1번/2번 선택지를 자유롭게 정하고 투표하세요!
        </p>
      </div>

      {/* Real-time Feedback Toast Banner */}
      {voteToast && (
        <div
          className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between shadow-xl transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
            voteToast.type === 'warning'
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
              : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{voteToast.type === 'warning' ? '⚠️' : '🎉'}</span>
            <span>{voteToast.message}</span>
          </div>
          <button
            onClick={() => setVoteToast(null)}
            className="text-xs px-2 py-0.5 rounded bg-black/30 hover:bg-black/50"
          >
            닫기
          </button>
        </div>
      )}

      {/* Main Battle Card (아레나 게이지) */}
      <div className="bg-[#111628] rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Title & Remaining Time Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              {currentTopic.numberTag}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white m-0">
              안건: {currentTopic.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-black shadow-md">
              <Flame className="w-4 h-4 animate-bounce" />
              <span>남은 시간: {currentTopic.remainingTime}</span>
            </div>
            <button
              onClick={handleOpenEditModal}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors border border-slate-700"
              title="이 안건의 선택지 문구 수정"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time Percentage & Votes Header */}
        <div className="grid grid-cols-2 gap-4 pt-2 relative z-10">
          {/* Option 1: Cyan Side */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                1번 선택지
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white line-clamp-1" title={cleanOpt1}>
              {cleanOpt1}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-black text-cyan-300 tracking-tight">
                {percent1}%
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400">
                ({opt1.votes}표)
              </span>
            </div>
          </div>

          {/* Option 2: Coral Pink Side */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                2번 선택지
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white line-clamp-1" title={cleanOpt2}>
              {cleanOpt2}
            </div>
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-400">
                ({opt2.votes}표)
              </span>
              <span className="text-3xl sm:text-5xl font-black text-rose-400 tracking-tight">
                {percent2}%
              </span>
            </div>
          </div>
        </div>

        {/* Dual Battle Progress Bar */}
        <div className="relative z-10">
          <div className="w-full h-7 rounded-2xl bg-slate-900 overflow-hidden flex border-2 border-slate-700/80 shadow-2xl p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-700 rounded-l-xl shadow-lg shadow-cyan-500/40"
              style={{ width: `${percent1}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-700 rounded-r-xl shadow-lg shadow-rose-500/40"
              style={{ width: `${percent2}%` }}
            />
          </div>
        </div>

        {/* Big Action Vote Buttons: Dynamic Purpose Matching */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 pt-2">
          {/* Vote Option 1 Button */}
          <button
            onClick={() => handleVoteClick(opt1.id)}
            className={`py-5 px-6 rounded-2xl font-black transition-all duration-200 shadow-xl flex flex-col items-center justify-center gap-1.5 group relative overflow-hidden ${
              currentTopic.userVotedOptionId === opt1.id
                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 ring-4 ring-cyan-400/50 scale-[1.02]'
                : 'bg-gradient-to-r from-cyan-900/60 to-slate-900 hover:from-cyan-600/40 hover:to-slate-800 text-white border-2 border-cyan-500/50 hover:border-cyan-400 hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  currentTopic.userVotedOptionId === opt1.id
                    ? 'bg-slate-950 text-cyan-300'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}
              >
                1번 선택지
              </span>
              {currentTopic.userVotedOptionId === opt1.id && (
                <span className="inline-flex items-center gap-1 text-[11px] font-black bg-white text-slate-900 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                  투표완료
                </span>
              )}
            </div>
            <span className="text-base sm:text-lg font-black text-center line-clamp-2 px-2 leading-snug">
              {cleanOpt1}
            </span>
            <span
              className={`text-xs font-semibold ${
                currentTopic.userVotedOptionId === opt1.id ? 'text-slate-900' : 'text-cyan-400/80'
              }`}
            >
              현재 {opt1.votes}표 ({percent1}%)
            </span>
          </button>

          {/* Vote Option 2 Button */}
          <button
            onClick={() => handleVoteClick(opt2.id)}
            className={`py-5 px-6 rounded-2xl font-black transition-all duration-200 shadow-xl flex flex-col items-center justify-center gap-1.5 group relative overflow-hidden ${
              currentTopic.userVotedOptionId === opt2.id
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white ring-4 ring-rose-400/50 scale-[1.02]'
                : 'bg-gradient-to-r from-rose-900/60 to-slate-900 hover:from-rose-600/40 hover:to-slate-800 text-white border-2 border-rose-500/50 hover:border-rose-400 hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  currentTopic.userVotedOptionId === opt2.id
                    ? 'bg-white text-rose-600'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                2번 선택지
              </span>
              {currentTopic.userVotedOptionId === opt2.id && (
                <span className="inline-flex items-center gap-1 text-[11px] font-black bg-white text-rose-900 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                  투표완료
                </span>
              )}
            </div>
            <span className="text-base sm:text-lg font-black text-center line-clamp-2 px-2 leading-snug">
              {cleanOpt2}
            </span>
            <span
              className={`text-xs font-semibold ${
                currentTopic.userVotedOptionId === opt2.id ? 'text-white/90' : 'text-rose-400/80'
              }`}
            >
              현재 {opt2.votes}표 ({percent2}%)
            </span>
          </button>
        </div>

        {/* Notice for already voted */}
        {currentTopic.userVotedOptionId && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 text-center text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
            <span>✓ 이미 이 안건에 투표하셨습니다. (1인당 1회만 투표 가능)</span>
          </div>
        )}

        {/* Footer Meta & Fast Edit Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-5 gap-3 relative z-10">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>총 투표자 수: {totalVotes}명 참여 완료</span>
            {currentTopic.userVotedOptionId && (
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
                내 투표 완료됨
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenEditModal}
              className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>선택지 목적/문구 맞춤 설정</span>
            </button>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              <span>실시간 결과 자동 반영 중 ⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          다른 진행 중인 자치 안건 투표 목록
         ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white m-0">
            다른 진행 중인 자치 안건 투표 목록
          </h3>
          <span className="text-xs text-slate-400">
            클릭하여 다른 안건으로 즉시 전환
          </span>
        </div>

        <div className="space-y-3">
          {votes.map((topic) => {
            const isSelected = topic.id === currentTopic.id;
            const tOpt1 = topic.options[0]?.name.replace(/^선지\s*\d+:\s*/, '');
            const tOpt2 = topic.options[1]?.name.replace(/^선지\s*\d+:\s*/, '');

            return (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-slate-800/80 border-cyan-400 ring-2 ring-cyan-400/20'
                    : 'bg-[#111628] border-slate-800/90 hover:border-slate-700 hover:bg-[#151c33]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    {topic.isHot ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black shrink-0">
                        <Flame className="w-3.5 h-3.5" />
                        HOT {topic.numberTag}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold shrink-0">
                        {topic.statusText} {topic.numberTag}
                      </span>
                    )}

                    <h4 className="text-sm sm:text-base font-black text-white m-0">
                      {topic.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-cyan-400 font-semibold">[1번] {tOpt1}</span>
                    <span className="text-slate-600">vs</span>
                    <span className="text-rose-400 font-semibold">[2번] {tOpt2}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 shrink-0">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    {topic.remainingTime}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          MODAL 1: 선택지 문구 & 목적 맞춤 수정 모달
         ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#111628] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                선택지 목적 맞춤 설정
              </div>
              <h3 className="text-xl font-black text-white m-0">
                투표 목적에 맞게 선택지 변경하기
              </h3>
              <p className="text-xs text-slate-400">
                무조건적인 찬성/반대가 아닌, 안건의 목적에 어울리는 1번/2번 선택지를 입력하세요.
              </p>
            </div>

            {/* Quick 1-click Preset Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                ⚡ 추천 투표 목적 프리셋 (원클릭 적용)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    {p.category}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* 안건 제목 */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  안건 제목
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="예: 가을 축제 E-Sports 메인 종목 선정"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* 1번 선택지 */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-cyan-400">
                  1번 선택지 명칭 / 목적 *
                </label>
                <input
                  type="text"
                  required
                  value={editOpt1}
                  onChange={(e) => setEditOpt1(e.target.value)}
                  placeholder="예: 발로란트 (5인 1팀 교내 리그전) 또는 자율 선택 코너"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* 2번 선택지 */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-rose-400">
                  2번 선택지 명칭 / 목적 *
                </label>
                <input
                  type="text"
                  required
                  value={editOpt2}
                  onChange={(e) => setEditOpt2(e.target.value)}
                  placeholder="예: 리그 오브 레전드 (소환사의 협곡) 또는 기존 정규 배식"
                  className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>선택지 변경 저장 및 실시간 적용</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: 새 자치 투표 안건 개설 모달
         ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#111628] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                새 자치 안건 등록
              </div>
              <h3 className="text-xl font-black text-white m-0">
                새로운 학생 자치 투표 개설
              </h3>
              <p className="text-xs text-slate-400">
                학우들의 의견을 모으고 싶은 자치 주제와 1번, 2번 선택지를 작성하세요.
              </p>
            </div>

            <form onSubmit={handleCreateNewTopic} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  안건 제목 *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: 2학기 학교 축제 테마 선호도 조사"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-400 mb-1.5">
                  1번 선택지 *
                </label>
                <input
                  type="text"
                  required
                  value={newOpt1}
                  onChange={(e) => setNewOpt1(e.target.value)}
                  placeholder="예: 사이버펑크 네온 페스티벌"
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-400 mb-1.5">
                  2번 선택지 *
                </label>
                <input
                  type="text"
                  required
                  value={newOpt2}
                  onChange={(e) => setNewOpt2(e.target.value)}
                  placeholder="예: 레트로 아케이드 게임존"
                  className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  투표 마감 일정
                </label>
                <select
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="D-1 남음">D-1 남음 (24시간 마감)</option>
                  <option value="D-3 남음">D-3 남음 (3일 후 마감)</option>
                  <option value="D-5 남음">D-5 남음 (5일 후 마감)</option>
                  <option value="D-7 남음">D-7 남음 (일주일 후 마감)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>새 투표 안건 즉시 등록</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
