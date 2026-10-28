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
  Award
} from 'lucide-react';

const DAYS = [
  { key: 'mon', label: '월요일' },
  { key: 'tue', label: '화요일' },
  { key: 'wed', label: '수요일' },
  { key: 'thu', label: '목요일' },
  { key: 'fri', label: '금요일' }
] as const;

const PERIODS = [1, 2, 3, 4, 5, 6, 7];

export const TimetableSection: React.FC = () => {
  const {
    timetable,
    selectedTimetableCell,
    setSelectedTimetableCell,
    updateTimetableCell,
    toggleTimetableQuestCompleted,
    setTab
  } = useApp();

  const [activeCellId, setActiveCellId] = useState<string | null>(
    selectedTimetableCell ? selectedTimetableCell.id : 'tue-1' // 화요일 1교시 수학 기본 선택 (와이어프레임 기준)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Edit fields
  const [editSubject, setEditSubject] = useState('');
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
  };

  const handleOpenEdit = () => {
    if (!activeCell) return;
    setEditSubject(activeCell.subject);
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

    updateTimetableCell(activeCell.id, {
      subject: editSubject.trim() || activeCell.subject,
      location: editLocation.trim(),
      items: editItems.trim(),
      questTitle: editQuestTitle.trim(),
      questDeadline: editQuestDeadline.trim(),
      hasAssignment: editHasAssignment,
      hasPreparation: editHasPreparation
    });

    setIsEditMode(false);
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

                  return (
                    <div
                      key={cell.id}
                      onClick={() => isAvailable && handleCellClick(cell)}
                      className={`relative p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[54px] select-none ${
                        !isAvailable
                          ? 'bg-slate-900/30 border-slate-800/40 text-slate-600'
                          : isSelected
                          ? 'bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-400/30 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850 hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Subject Name */}
                      <span
                        className={`text-xs sm:text-sm font-bold tracking-tight ${
                          !isAvailable
                            ? 'text-slate-600'
                            : isSelected
                            ? 'text-white font-black'
                            : 'text-slate-200'
                        }`}
                      >
                        {cell.subject}
                      </span>

                      {/* Wireframe Badges */}
                      {cell.hasAssignment && (
                        <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-400 leading-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          <span>과제 있음</span>
                        </div>
                      )}

                      {cell.hasPreparation && (
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
                미완료 과제: {timetable.filter((c) => c.hasAssignment && !c.isCompleted).length}건
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-300">
                지참 준비물: {timetable.filter((c) => c.hasPreparation).length}건
              </span>
            </div>
          </div>

          <div className="text-slate-500 text-[11px]">
            * 과목 카드를 클릭하면 상세 교실 위치 및 퀘스트 요강을 확인할 수 있습니다.
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
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                  title="이 시간표 정보 직접 수정하기"
                >
                  <Edit3 className="w-4 h-4" />
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
                        {activeCell.items || '별도 준비물 없음 (교과서 및 필기구 지참)'}
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
                        activeCell.hasAssignment || activeCell.questTitle
                          ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="text-sm font-bold text-slate-900">
                        {activeCell.questTitle || '등록된 과제가 없습니다. 편안한 수업 되세요!'}
                      </div>
                      {activeCell.questDeadline && (
                        <div className="text-xs font-medium text-rose-600">
                          기한: {activeCell.questDeadline}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action: 퀘스트 완료 체크 토글 */}
                  {activeCell.questTitle && (
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
                  )}
                </>
              ) : (
                /* Edit Form */
                <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      과목명 *
                    </label>
                    <input
                      type="text"
                      required
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
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
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      취소
                    </button>
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
