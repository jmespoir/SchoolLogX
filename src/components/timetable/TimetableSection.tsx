import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TimetableCell } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Backpack,
  ScrollText,
  CheckCircle2,
  Circle,
  Edit3,
  ArrowLeft,
  Sparkles,
  X,
  ChevronDown,
  Check,
  Flame,
  Award,
  RefreshCw,
  RotateCcw
} from 'lucide-react';

const DAYS = [
  { key: 'mon', label: '월요일' },
  { key: 'tue', label: '화요일' },
  { key: 'wed', label: '수요일' },
  { key: 'thu', label: '목요일' },
  { key: 'fri', label: '금요일' }
] as const;

const PERIODS = [1, 2, 3, 4, 5, 6, 7];

const QUICK_SUBJECTS = [
  '국어', '수학', '영어', '과학', '사회', '역사',
  '체육', '미술', '음악', '도덕', '정보', '진로',
  '자율', '창체', '동아리', '공강(-)'
];

export const TimetableSection: React.FC = () => {
  const {
    timetable,
    selectedTimetableCell,
    setSelectedTimetableCell,
    updateTimetableCell,
    revertTimetableCell,
    toggleTimetableQuestCompleted,
    setTab
  } = useApp();

  const [activeCellId, setActiveCellId] = useState<string | null>(
    selectedTimetableCell ? selectedTimetableCell.id : 'tue-1' // 화요일 1교시 수학 기본 선택 (와이어프레임 기준)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit fields
  const [editSubject, setEditSubject] = useState('');
  const [editChangeReason, setEditChangeReason] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editItems, setEditItems] = useState('');
  const [editQuestTitle, setEditQuestTitle] = useState('');
  const [editQuestDeadline, setEditQuestDeadline] = useState('');
  const [editHasAssignment, setEditHasAssignment] = useState(false);
  const [editHasPreparation, setEditHasPreparation] = useState(false);

  const activeCell = timetable.find((c) => c.id === activeCellId) || timetable[0];

  const handleCellClick = (cell: TimetableCell) => {
    if (cell.subject === '-') return;
    setActiveCellId(cell.id);
    setSelectedTimetableCell(cell);
    setIsModalOpen(true);
    setIsEditMode(false);

    // 과제나 준비물 표시가 없는 시간을 클릭했을 때 알림 토스트 표시
    const hasAnyTask = (cell.hasAssignment && Boolean(cell.questTitle)) || (cell.hasPreparation && Boolean(cell.items));
    if (!hasAnyTask) {
      setToastMessage(`[${cell.subject}] 등록된 과제가 없습니다.`);
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      setToastMessage(null);
    }
  };

  const handleOpenEdit = () => {
    if (!activeCell) return;
    setEditSubject(activeCell.subject);
    setEditChangeReason(activeCell.changeReason || '');
    setEditLocation(activeCell.location || '');
    setEditItems(activeCell.items || '');
    setEditQuestTitle(activeCell.questTitle || '');
    setEditQuestDeadline(activeCell.questDeadline || '');
    setEditHasAssignment(Boolean(activeCell.hasAssignment));
    setEditHasPreparation(Boolean(activeCell.hasPreparation));
    setIsEditMode(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCell) return;

    const newSubject = editSubject.trim() || activeCell.subject;
    const orig = activeCell.originalSubject || activeCell.subject;
    const isNowChanged = newSubject !== orig;

    updateTimetableCell(activeCell.id, {
      subject: newSubject,
      isChanged: isNowChanged,
      changeReason: isNowChanged ? editChangeReason.trim() : '',
      location: editLocation.trim(),
      items: editItems.trim(),
      questTitle: editQuestTitle.trim(),
      questDeadline: editQuestDeadline.trim(),
      hasAssignment: editHasAssignment,
      hasPreparation: editHasPreparation
    });

    setIsEditMode(false);
  };

  const handleRevert = () => {
    if (!activeCell) return;
    revertTimetableCell(activeCell.id);
    setIsEditMode(false);
  };

  return (
    <div className="space-y-6 py-4 max-w-5xl mx-auto relative">
      {/* Toast Notice for No Assignment Cell */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0d1326] border border-cyan-500/60 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300">💡 {toastMessage}</span>
        </div>
      )}

      {/* Back to Home Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setTab('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/80 transition-all hover:-translate-x-0.5"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>메인 허브로 돌아가기</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full">
          <span>👆</span>
          <span>과목 클릭 시 퀘스트(상세정보) 확인</span>
        </div>
      </div>

      {/* Title Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>스마트 시간표 시스템</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white m-0 mt-1">
          스마트 시간표
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          학생 주도형 일정 관리 및 퀘스트(과제) 연동 시스템으로 오늘 하루의 수업 장소와 과제를 점검하세요.
        </p>
      </div>

      {/* Timetable Table Card (와이어프레임 12 기반) */}
      <div className="bg-[#111628] rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl space-y-4">
        {/* Table Container */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="min-w-[620px] space-y-2.5">
            {/* Header Row: Days */}
            <div className="grid grid-cols-6 gap-2 sm:gap-3 text-center">
              <div className="flex items-center justify-center text-xs font-bold text-slate-400 py-2.5">
                교시
              </div>
              {DAYS.map((day) => (
                <div
                  key={day.key}
                  className="py-3 px-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/20 tracking-tight"
                >
                  {day.label}
                </div>
              ))}
            </div>

            {/* Period Rows (1교시 ~ 7교시) */}
            {PERIODS.map((period) => (
              <div
                key={period}
                className="grid grid-cols-6 gap-2 sm:gap-3 items-stretch"
              >
                {/* Period Label (1교시, 2교시 ...) */}
                <div className="flex items-center justify-center rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs sm:text-sm font-bold text-slate-400">
                  {period}교시
                </div>

                {/* Day Cells */}
                {DAYS.map((day) => {
                  const cell = timetable.find(
                    (c) => c.day === day.key && c.period === period
                  );

                  if (!cell) {
                    return (
                      <div
                        key={`${day.key}-${period}`}
                        className="p-3 rounded-2xl bg-slate-900/30 border border-slate-800/40 text-center text-slate-600 text-xs flex items-center justify-center min-h-[52px]"
                      >
                        -
                      </div>
                    );
                  }

                  const isSelected = activeCellId === cell.id;
                  const isAvailable = cell.subject !== '-';
                  const isChanged = Boolean(cell.isChanged);

                  return (
                    <div
                      key={cell.id}
                      onClick={() => isAvailable && handleCellClick(cell)}
                      className={`relative p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[54px] select-none ${
                        !isAvailable
                          ? 'bg-slate-900/30 border-slate-800/40 text-slate-600'
                          : isSelected
                          ? isChanged
                            ? 'bg-gradient-to-br from-purple-900/90 to-indigo-950 border-purple-400 ring-2 ring-purple-300 shadow-xl shadow-purple-500/40 scale-[1.03]'
                            : 'bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-400/30 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                          : isChanged
                          ? 'bg-gradient-to-br from-[#2a164d] via-[#1f113a] to-[#120a24] border-purple-500/80 text-purple-100 shadow-lg shadow-purple-950/50 ring-1 ring-purple-400/40 hover:border-purple-300 hover:scale-[1.02]'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850 hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Subject Name */}
                      <span
                        className={`text-xs sm:text-sm font-bold tracking-tight ${
                          !isAvailable
                            ? 'text-slate-600'
                            : isChanged
                            ? 'text-purple-200 font-black'
                            : isSelected
                            ? 'text-white font-black'
                            : 'text-slate-200'
                        }`}
                      >
                        {cell.subject}
                      </span>

                      {/* 시간표 변동 배지 */}
                      {isChanged && (
                        <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/50 text-[10px] font-black text-purple-200 leading-none">
                          <RefreshCw className="w-2.5 h-2.5 text-purple-300" />
                          <span>변동</span>
                        </div>
                      )}

                      {/* Wireframe Badges: 과제나 준비물이 있을 때만 표시 */}
                      {cell.hasAssignment && Boolean(cell.questTitle) && !cell.isCompleted && (
                        <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-400 leading-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          <span>과제 있음</span>
                        </div>
                      )}

                      {cell.hasPreparation && Boolean(cell.items) && (
                        <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 leading-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>준비물</span>
                        </div>
                      )}

                      {cell.isCompleted && (
                        <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 leading-none">
                          <Check className="w-2.5 h-2.5" />
                          <span>완료</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Timetable Bottom Summary Widget */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="font-semibold text-slate-300">
                미완료 과제: {timetable.filter((c) => c.hasAssignment && Boolean(c.questTitle) && !c.isCompleted).length}건
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-300">
                지참 준비물: {timetable.filter((c) => c.hasPreparation && Boolean(c.items)).length}건
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="font-bold text-purple-300">
                시간표 변동: {timetable.filter((c) => c.isChanged).length}건
              </span>
            </div>
          </div>

          <div className="text-slate-500 text-[11px]">
            * 과목 카드를 클릭하면 상세 교실 위치 및 퀘스트 요강, 시간표 변동을 관리할 수 있습니다.
          </div>
        </div>
      </div>

      {/* ========================================================
          과목 상세 정보 모달 (와이어프레임 Page 3)
         ======================================================== */}
      {isModalOpen && activeCell && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white text-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Top Header Banner (와이어프레임 Page 3: Purple/Blue Gradient Banner) */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 sm:p-7 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black m-0 tracking-tight">
                  {activeCell.subject} 상세 정보
                </h3>
                <p className="text-xs text-indigo-100/90 mt-0.5">
                  수업 장소, 장착 아이템(준비물) 및 메인 퀘스트
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenEdit}
                  className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center gap-1.5 text-xs font-bold transition-colors"
                  title="과목 변경 및 시간표 변동"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>시간표 변동 / 수정</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-5">
              {!isEditMode ? (
                <>
                  {/* Period Tag Box (와이어프레임 Page 3: "화요일 / 1교시") */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-800">
                      {activeCell.dayLabel} / {activeCell.period}교시
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                      정규 수업
                    </span>
                  </div>

                  {/* 시간표 변동 안내 배너 */}
                  {activeCell.isChanged && (
                    <div className="p-4 rounded-2xl bg-purple-50/90 border border-purple-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-300 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          🔄
                        </div>
                        <div>
                          <div className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                            <span>시간표 변동 과목</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-200 text-purple-800 font-bold">
                              변동됨
                            </span>
                          </div>
                          <p className="text-[11px] text-purple-900 mt-0.5">
                            원래 시간표: <span className="line-through text-slate-500 font-semibold">{activeCell.originalSubject || '-'}</span> → 변경된 과목: <span className="font-bold text-purple-700">{activeCell.subject}</span>
                          </p>
                          {activeCell.changeReason && (
                            <p className="text-[10px] text-slate-500 mt-0.5 italic">
                              사유: {activeCell.changeReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRevert}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors shadow-sm flex items-center gap-1 flex-shrink-0"
                        title="원래 과목으로 되돌리기"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>원래대로</span>
                      </button>
                    </div>
                  )}

                  {/* 과제/준비물 없음 안내 배너 (표시가 없는 시간 클릭 시 명시) */}
                  {(!activeCell.hasAssignment || !activeCell.questTitle) && (!activeCell.hasPreparation || !activeCell.items) && (
                    <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
                        ✨
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                          <span>과제가 없습니다</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200/70 text-emerald-800 font-bold">
                            과제 없음
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
                          현재 등록된 과제 및 특별 준비물이 없는 여유로운 수업 시간입니다.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Section 1: 장소 및 장착 아이템(준비물) (와이어프레임 Page 3) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <span className="text-blue-500 font-black">📍</span>
                      <span>장소 및 장착 아이템(준비물)</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1.5">
                      <div className="text-sm font-extrabold text-slate-900">
                        {activeCell.location || '교실 미지정'}
                      </div>
                      <div className="text-xs font-medium text-slate-500 leading-relaxed">
                        {activeCell.hasPreparation && activeCell.items
                          ? activeCell.items
                          : '별도 준비물 없음 (교과서 및 필기구 지참)'}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: 메인 퀘스트 (해올 과제) (와이어프레임 Page 3) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <span className="text-rose-500 font-black">📜</span>
                      <span>메인 퀘스트 (해올 과제)</span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border transition-all space-y-2 ${
                        activeCell.hasAssignment && activeCell.questTitle
                          ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-slate-900">
                          {activeCell.hasAssignment && activeCell.questTitle
                            ? activeCell.questTitle
                            : '등록된 과제가 없습니다.'}
                        </div>
                        {(!activeCell.hasAssignment || !activeCell.questTitle) && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                            과제 없음
                          </span>
                        )}
                      </div>
                      {activeCell.hasAssignment && activeCell.questDeadline && (
                        <div className="text-xs font-medium text-rose-600">
                          기한: {activeCell.questDeadline}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action: 퀘스트 완료 체크 토글 또는 과제/변동 등록 버튼 */}
                  {activeCell.hasAssignment && activeCell.questTitle ? (
                    <div className="pt-2">
                      <button
                        onClick={() => toggleTimetableQuestCompleted(activeCell.id)}
                        className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                          activeCell.isCompleted
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {activeCell.isCompleted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>퀘스트 완수 완료! (다시 체크하여 취소)</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4" />
                            <span>과제 수행 완료 체크하기</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={handleOpenEdit}
                        className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-200"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
                        <span>시간표 변동(과목 변경) / 과제 등록</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Edit Form */
                <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                  {/* 과목명 변경 & 시간표 변동 */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        과목명 (시간표 변동) *
                      </label>
                      <span className="text-[11px] text-slate-500">
                        기존 과목: <strong className="text-indigo-600">{activeCell.originalSubject || activeCell.subject}</strong>
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      placeholder="과목명을 입력하거나 아래에서 선택하세요"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    />

                    {/* 빠른 과목 선택 버튼들 */}
                    <div className="mt-2 space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-500">
                        빠른 과목 선택:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_SUBJECTS.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => setEditSubject(sub)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                              editSubject === sub
                                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 변동 사유 입력 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      시간표 변동 사유 (선택 입력)
                    </label>
                    <input
                      type="text"
                      value={editChangeReason}
                      onChange={(e) => setEditChangeReason(e.target.value)}
                      placeholder="예: 선생님 출장으로 체육 수업 교체, 특별 자치 활동"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      장소 (교실 위치)
                    </label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="예: 본관 3층 수학 전용 교실"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      장착 아이템(준비물)
                    </label>
                    <input
                      type="text"
                      value={editItems}
                      onChange={(e) => setEditItems(e.target.value)}
                      placeholder="예: 수학 교과서, 삼각자 세트, 검은색 볼펜"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      메인 퀘스트 (해올 과제 내용)
                    </label>
                    <textarea
                      rows={2}
                      value={editQuestTitle}
                      onChange={(e) => setEditQuestTitle(e.target.value)}
                      placeholder="예: 교과서 45p ~ 48p 연습문제 풀이"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      과제 제출 기한
                    </label>
                    <input
                      type="text"
                      value={editQuestDeadline}
                      onChange={(e) => setEditQuestDeadline(e.target.value)}
                      placeholder="예: 다음 수업 시간 전까지 제출"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={editHasAssignment}
                        onChange={(e) => setEditHasAssignment(e.target.checked)}
                        className="rounded text-indigo-600 accent-indigo-600"
                      />
                      <span>과제 있음 뱃지 표시</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={editHasPreparation}
                        onChange={(e) => setEditHasPreparation(e.target.checked)}
                        className="rounded text-amber-500 accent-amber-500"
                      />
                      <span>준비물 뱃지 표시</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      취소
                    </button>
                    {(activeCell.isChanged || editSubject !== activeCell.originalSubject) && (
                      <button
                        type="button"
                        onClick={handleRevert}
                        className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 flex items-center justify-center gap-1 transition-colors"
                        title="원래 시간표 과목으로 되돌리기"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>원래대로</span>
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30"
                    >
                      수정사항 저장
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
