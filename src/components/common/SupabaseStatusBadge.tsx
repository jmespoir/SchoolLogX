import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, CheckCircle2, AlertTriangle, ExternalLink, Copy, Check, RefreshCw, X } from 'lucide-react';

export const SupabaseStatusBadge: React.FC = () => {
  const { isSupabaseConnected, isLoadingBackend, refreshFromBackend } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySqlPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
          isSupabaseConnected
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
        }`}
        title="Supabase 백엔드 연동 상태"
      >
        <Database className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {isSupabaseConnected ? 'Supabase 연동됨' : 'Supabase 설정'}
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`}
        />
      </button>

      {/* Supabase Setup / Status Guide Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#111628] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isSupabaseConnected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white m-0">
                  Supabase 백엔드 연동 현황
                </h3>
                <p className="text-xs text-slate-400">
                  {isSupabaseConnected
                    ? '클라우드 데이터베이스와 정상적으로 동기화 중입니다.'
                    : '현재 로컬 오프라인 모드로 실행 중입니다.'}
                </p>
              </div>
            </div>

            {/* Status Card */}
            <div
              className={`p-4 rounded-2xl border ${
                isSupabaseConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              } flex items-start gap-3 text-xs`}
            >
              {isSupabaseConnected ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
              )}
              <div className="space-y-1">
                <div className="font-bold">
                  {isSupabaseConnected
                    ? 'Supabase 클라우드 실시간 동기화 활성화'
                    : 'Supabase API 키 설정 대기 중'}
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {isSupabaseConnected
                    ? '게시글, 댓글, 소모임 파티 슬롯, 신문고 민원, 실시간 투표 데이터가 Supabase와 연동되어 보관됩니다.'
                    : '.env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 입력하시면 클라우드 DB가 활성화됩니다. 현재는 브라우저 로컬 저장소 모드로 안전하게 작동합니다.'}
                </p>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-200">🚀 Supabase 3단계 빠른 연동 가이드</h4>
              
              <div className="space-y-2 text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">1. Supabase 프로젝트 생성</div>
                  <p className="text-slate-400">
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 underline inline-flex items-center gap-1 hover:text-cyan-300"
                    >
                      Supabase 대시보드 <ExternalLink className="w-3 h-3" />
                    </a>
                    에서 새 프로젝트를 생성합니다.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-indigo-400">2. 데이터베이스 스키마 실행 (SQL Editor)</div>
                  <p className="text-slate-400">
                    프로젝트의 <span className="text-slate-200 font-mono">supabase/schema.sql</span> 파일 내용을 복사하여 Supabase SQL Editor에서 실행(Run)하세요. (모든 테이블, RLS 권한, 샘플 데이터, 스토리지 버킷 자동 생성)
                  </p>
                  <button
                    onClick={handleCopySqlPath}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? '파일명 복사 완료!' : 'supabase/schema.sql'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400">3. .env 환경 변수 설정</div>
                  <p className="text-slate-400">
                    Supabase [Project Settings &gt; API]의 Project URL과 anon key를 프로젝트 루트의 <span className="text-slate-200 font-mono">.env</span> 파일에 입력하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* Sync Refresh Button */}
            {isSupabaseConnected && (
              <button
                onClick={() => {
                  refreshFromBackend();
                  setIsOpen(false);
                }}
                disabled={isLoadingBackend}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBackend ? 'animate-spin' : ''}`} />
                <span>지금 클라우드 데이터 새로고침</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
