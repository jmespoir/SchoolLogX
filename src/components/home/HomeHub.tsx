import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Rocket,
  Users2,
  Contact2,
  Vote,
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const HomeHub: React.FC = () => {
  const { setTab, quest, votes, petitions } = useApp();
  const hotVote = votes.find((v) => v.isHot) || votes[0];

  return (
    <div className="space-y-12 py-6">
      {/* Hero Title Section (Wireframe P.1) */}
      <div className="text-left md:text-center space-y-4 max-w-4xl mx-auto pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Gamified School Community
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white m-0">
          School Log <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400">X</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
          작품 전시부터 퀘스트형 소모임 모집, 스마트 신문고와 실시간 자치 투표까지.
          학생들의 즐거운 학교 생활을 위한 인터랙티브 허브입니다.
        </p>
      </div>

      {/* 4 Main Core Action Cards (Wireframe P.1 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. 카테고리 취미 전시관 */}
        <div
          onClick={() => setTab('hobby')}
          className="group relative bg-[#13182b] hover:bg-[#181f38] border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                카테고리 취미 전시관
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                당신의 취미를 기다려요
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-indigo-400 transition-colors">
            <span>5대 카테고리 탐색</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 2. 취미 공유 소모임 */}
        <div
          onClick={() => setTab('quest')}
          className="group relative bg-[#13182b] hover:bg-[#181f38] border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                취미 공유 소모임
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                같은 취미 하기 시이작!
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-cyan-400 transition-colors">
            <span>퀘스트 파티 참여</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 3. 개인 프로필 */}
        <div
          onClick={() => setTab('profile')}
          className="group relative bg-[#13182b] hover:bg-[#181f38] border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Contact2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                개인 프로필
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                이름, 취미 및 SNS 연동
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-emerald-400 transition-colors">
            <span>게이머태그 카드</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 4. 신문고 & 투표 아레나 */}
        <div
          onClick={() => setTab('petition')}
          className="group relative bg-[#13182b] hover:bg-[#181f38] border border-slate-800/80 hover:border-amber-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                신문고 & 투표 아레나
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                스마트 민원 및 실시간 투표
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-amber-400 transition-colors">
            <span>민원 제기 & 실시간 투표</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Live Preview Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Live Vote Teaser */}
        <div className="bg-[#111628] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                HOT 실시간 투표
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {hotVote.remainingTime}
              </span>
            </div>
            <h4 className="text-base font-bold text-white line-clamp-1">
              {hotVote.title}
            </h4>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span className="text-cyan-400">찬성 {hotVote.options[0].votes}표</span>
                <span className="text-rose-400">반대 {hotVote.options[1].votes}표</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-cyan-500 h-full transition-all"
                  style={{
                    width: `${Math.round(
                      (hotVote.options[0].votes /
                        (hotVote.options[0].votes + hotVote.options[1].votes || 1)) *
                        100
                    )}%`
                  }}
                />
                <div
                  className="bg-rose-500 h-full transition-all"
                  style={{
                    width: `${Math.round(
                      (hotVote.options[1].votes /
                        (hotVote.options[0].votes + hotVote.options[1].votes || 1)) *
                        100
                    )}%`
                  }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => setTab('vote')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
          >
            투표 아레나 바로가기
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Quest Slot Teaser */}
        <div className="bg-[#111628] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                <Users2 className="w-3.5 h-3.5" />
                모집 진행 중 소모임
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                {quest.dDay}
              </span>
            </div>
            <h4 className="text-base font-bold text-white line-clamp-1">
              {quest.title}
            </h4>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>참가 파티 현황</span>
                <span className="text-cyan-400 font-bold">
                  {quest.currentCount} / {quest.maxCount} 명
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (quest.currentCount / quest.maxCount) * 100)}%`
                  }}
                />
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                파티장: {quest.leader}
              </div>
            </div>
          </div>
          <button
            onClick={() => setTab('quest')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
          >
            소모임 파티 슬롯 보기
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Petition Timeline Teaser */}
        <div className="bg-[#111628] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                실시간 민원 처리 현황
              </div>
              <span className="text-xs text-slate-400">
                {petitions[0].refNumber}
              </span>
            </div>
            <h4 className="text-base font-bold text-white line-clamp-1">
              {petitions[0].title}
            </h4>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">현재 진행 상태</span>
                <span className="text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded">
                  {petitions[0].statusLabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 italic line-clamp-1">
                "{petitions[0].adminFeedback}"
              </p>
            </div>
          </div>
          <button
            onClick={() => setTab('petition')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1"
          >
            3단계 타임라인 확인하기
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
