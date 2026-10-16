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
  ArrowLeft
} from 'lucide-react';

export const VoteArena: React.FC = () => {
  const { votes, selectedVote, setSelectedVoteId, castVote, setTab } = useApp();
  const [activeTopic, setActiveTopic] = useState<VoteTopic>(selectedVote);
  const [voteToast, setVoteToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  const currentTopic = votes.find((v) => v.id === activeTopic.id) || activeTopic;

  const opt1 = currentTopic.options[0];
  const opt2 = currentTopic.options[1];
  const totalVotes = opt1.votes + opt2.votes;

  const percent1 = totalVotes === 0 ? 50 : Math.round((opt1.votes / totalVotes) * 100);
  const percent2 = 100 - percent1;

  const handleSelectTopic = (topic: VoteTopic) => {
    setActiveTopic(topic);
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

  return (
    <div className="space-y-6 py-4 max-w-5xl mx-auto">
      {/* Back to Home Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setTab('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/80 transition-all hover:-translate-x-0.5"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>메인 허브로 돌아가기</span>
        </button>
      </div>

      {/* Title Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
          학생 자치 투표 아레나
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white m-0">
          실시간 참여형 학생 자치 투표 아레나
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          학우들의 목소리로 학교 생활 규칙과 복지 안건을 직접 결정합니다.
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

      {/* 학생 투표 상세 화면 (아레나 게이지) */}
      <div className="bg-[#111628] rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Title & Remaining Time Timer (Wireframe P.12) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              {currentTopic.numberTag}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white m-0">
              안건: {currentTopic.title}
            </h3>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-black shadow-md self-start sm:self-auto">
            <Flame className="w-4 h-4 animate-bounce" />
            <span>남은 시간: {currentTopic.remainingTime}</span>
          </div>
        </div>

        {/* Real-time Percentage & Votes Header (Wireframe P.12) */}
        <div className="grid grid-cols-2 gap-4 pt-4 relative z-10">
          {/* Option 1: Cyan Side */}
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-black text-cyan-400">
              {opt1.name}
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
          <div className="space-y-1 text-right">
            <div className="text-xs sm:text-sm font-black text-rose-400">
              {opt2.name}
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

        {/* Dual Battle Progress Bar (Wireframe P.12 Gauge Bar) */}
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

        {/* Big Action Vote Buttons (Wireframe P.12) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 pt-2">
          {/* Vote Option 1 Button */}
          <button
            onClick={() => handleVoteClick(opt1.id)}
            className={`py-5 px-6 rounded-2xl font-black text-lg transition-all duration-200 shadow-xl flex items-center justify-center gap-2 group ${
              currentTopic.userVotedOptionId === opt1.id
                ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-400/50 scale-[1.02]'
                : 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white hover:scale-[1.02]'
            }`}
          >
            {currentTopic.userVotedOptionId === opt1.id && (
              <CheckCircle2 className="w-5 h-5 text-slate-950" />
            )}
            <span>찬성 (선택 1)</span>
          </button>

          {/* Vote Option 2 Button */}
          <button
            onClick={() => handleVoteClick(opt2.id)}
            className={`py-5 px-6 rounded-2xl font-black text-lg transition-all duration-200 shadow-xl flex items-center justify-center gap-2 group ${
              currentTopic.userVotedOptionId === opt2.id
                ? 'bg-rose-500 text-white ring-4 ring-rose-400/50 scale-[1.02]'
                : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white hover:scale-[1.02]'
            }`}
          >
            {currentTopic.userVotedOptionId === opt2.id && (
              <CheckCircle2 className="w-5 h-5 text-white" />
            )}
            <span>반대 (선택 2)</span>
          </button>
        </div>

        {/* Notice for already voted */}
        {currentTopic.userVotedOptionId && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 text-center text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
            <span>✓ 이미 이 안건에 투표하셨습니다. (1인당 1회만 투표 가능)</span>
          </div>
        )}

        {/* Footer Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-5 gap-2 relative z-10">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>총 투표자 수: {totalVotes}명 참여 완료</span>
            {currentTopic.userVotedOptionId && (
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
                내 투표 완료됨
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Zap className="w-3.5 h-3.5" />
            <span>실시간 결과 자동 반영 중 ⚡</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          WIREFRAME 10 (P.11): 실시간 참여형 학생 자치 투표 아레나 목록
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
            return (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-slate-800/80 border-cyan-400 ring-2 ring-cyan-400/20'
                    : 'bg-[#111628] border-slate-800/90 hover:border-slate-700 hover:bg-[#151c33]'
                }`}
              >
                <div className="flex items-center gap-3">
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
    </div>
  );
};
