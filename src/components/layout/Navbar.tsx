import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  ChevronRight,
  Gamepad2,
  Users,
  ShieldAlert,
  Vote,
  UserCheck,
  Calendar
} from 'lucide-react';
import { SupabaseStatusBadge } from '../common/SupabaseStatusBadge';

export const Navbar: React.FC = () => {
  const { tab, setTab, user } = useApp();

  const getTabTitle = () => {
    switch (tab) {
      case 'timetable':
        return { label: '스마트 시간표', icon: <Calendar className="w-3.5 h-3.5 text-indigo-400" /> };
      case 'hobby':
        return { label: '취미 전시관', icon: <Gamepad2 className="w-3.5 h-3.5 text-pink-400" /> };
      case 'quest':
        return { label: '취미 공유 소모임 (퀘스트)', icon: <Users className="w-3.5 h-3.5 text-cyan-400" /> };
      case 'petition':
        return { label: '스마트 신문고', icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> };
      case 'vote':
        return { label: '투표 아레나', icon: <Vote className="w-3.5 h-3.5 text-rose-400" /> };
      case 'profile':
        return { label: '개인 프로필', icon: <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> };
      default:
        return null;
    }
  };

  const currentTabInfo = getTabTitle();

  return (
    <header className="sticky top-0 z-40 bg-[#0b0e1b]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo (클릭 시 메인 허브로 이동) */}
        <div
          onClick={() => setTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d111e] rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-cyan-300 text-lg">
              X
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                School Log X
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PROD 2.0
              </span>
            </div>
            <p className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
              Gamified School Community
            </p>
          </div>
        </div>

        {/* Center Breadcrumb Indicator & Home Button */}
        <div className="flex items-center gap-2">
          {tab !== 'home' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab('home')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/70 transition-all hover:scale-105 shadow-sm"
              >
                <Home className="w-3.5 h-3.5 text-cyan-400" />
                <span>메인 허브로 가기</span>
              </button>
              {currentTabInfo && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {currentTabInfo.icon}
                  <span>{currentTabInfo.label}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              메인 허브에서 원하는 메뉴 카드를 선택해 주세요
            </div>
          )}
        </div>

        {/* Right Action & Status Group */}
        <div className="flex items-center gap-2.5">
          <SupabaseStatusBadge />

          {/* User Info Badge (클릭 시 프로필 화면으로 이동) */}
          <div
            onClick={() => setTab('profile')}
            role="button"
            tabIndex={0}
            title="개인 프로필 보기"
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-left select-none cursor-pointer transition-all duration-200 hover:scale-105 ${
              tab === 'profile'
                ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors ${
                tab === 'profile'
                  ? 'bg-emerald-500/20 border border-emerald-500/50'
                  : 'bg-indigo-500/20 border border-indigo-500/40'
              }`}
            >
              {user.avatarIcon}
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-bold leading-tight ${
                    tab === 'profile' ? 'text-emerald-300' : 'text-slate-200'
                  }`}
                >
                  {user.gamerTag}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                Lv.12 학생 자치원
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
