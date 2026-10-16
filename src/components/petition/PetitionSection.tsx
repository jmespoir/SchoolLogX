import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PETITION_CATEGORIES } from '../../data/mockData';
import {
  FileText,
  Clock,
  Vote,
  Wrench,
  Headphones,
  Building2,
  MessageSquareText,
  Lock,
  Unlock,
  Send,
  ArrowRight,
  Camera,
  ArrowLeft,
  Trash2,
  X,
  ZoomIn,
  AlertCircle
} from 'lucide-react';

type SubView = 'dashboard' | 'categories' | 'form' | 'timeline';

export const PetitionSection: React.FC = () => {
  const {
    petitions,
    selectedPetition,
    setSelectedPetitionId,
    addPetition,
    setTab,
    user
  } = useApp();

  const [subView, setSubView] = useState<SubView>('dashboard');
  const [selectedCat, setSelectedCat] = useState<string>('학교 시설');

  // Form states - 모든 칸의 기본값은 공란!
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [notes, setNotes] = useState('');
  
  // Real Photo Upload state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Field validation errors
  const [errors, setErrors] = useState<{
    title?: string;
    reason?: string;
    expectedOutcome?: string;
    notes?: string;
    general?: string;
  }>({});

  // Fullscreen photo lightbox
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-6 h-6" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6" />;
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      default:
        return <MessageSquareText className="w-6 h-6" />;
    }
  };

  const handleCategorySelect = (categoryTitle: string) => {
    setSelectedCat(categoryTitle);
    setSubView('form');
  };

  // Real File Upload Handler (FileReader -> Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, GIF 등)만 첨부할 수 있습니다.');
      return;
    }

    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Meaningful Text Validator: 공백이나 특수문자만으로 작성된 형식 차단!
  const validateField = (text: string, minMeaningfulChars: number = 3): { isValid: boolean; message: string } => {
    if (!text || text.trim().length === 0) {
      return { isValid: false, message: '이 칸은 필수 입력 항목입니다. 공란으로 둘 수 없습니다.' };
    }

    // 한글, 영문, 숫자 문자만 추출
    const meaningfulChars = text.replace(/[^가-힣a-zA-Z0-9]/g, '');

    if (meaningfulChars.length === 0) {
      return {
        isValid: false,
        message: '공백이나 특수문자만으로는 접수할 수 없습니다. 올바른 한글, 영문 또는 숫자를 포함해 작성해 주세요.'
      };
    }

    if (meaningfulChars.length < minMeaningfulChars) {
      return {
        isValid: false,
        message: `유효한 문자가 너무 적습니다. 최소 ${minMeaningfulChars}자 이상의 올바른 단어를 작성해 주세요.`
      };
    }

    return { isValid: true, message: '' };
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const titleVal = validateField(title, 3);
    const reasonVal = validateField(reason, 5);
    const outcomeVal = validateField(expectedOutcome, 3);
    const notesVal = validateField(notes, 2);

    const newErrors: {
      title?: string;
      reason?: string;
      expectedOutcome?: string;
      notes?: string;
      general?: string;
    } = {};

    if (!titleVal.isValid) newErrors.title = titleVal.message;
    if (!reasonVal.isValid) newErrors.reason = reasonVal.message;
    if (!outcomeVal.isValid) newErrors.expectedOutcome = outcomeVal.message;
    if (!notesVal.isValid) newErrors.notes = notesVal.message;

    if (Object.keys(newErrors).length > 0) {
      newErrors.general = '한 칸이라도 빈 칸이 있거나 특수문자/공백만으로 채워진 항목이 있으면 민원을 접수할 수 없습니다.';
      setErrors(newErrors);
      return;
    }

    // Validation Passed!
    setErrors({});
    addPetition({
      title: title.trim(),
      category: selectedCat,
      isAnonymous,
      reason: reason.trim(),
      expectedOutcome: expectedOutcome.trim(),
      notes: notes.trim(),
      photoUrl: photoPreview || undefined
    });

    // Reset form to empty
    setTitle('');
    setReason('');
    setExpectedOutcome('');
    setNotes('');
    setPhotoPreview(null);
    setPhotoFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setSubView('timeline');
  };

  return (
    <div className="space-y-6 py-4">
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

      {/* Sub Nav Tab Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            신문고 & 자치 안건 시스템
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white m-0">
            {subView === 'dashboard' && '학생 안건 반영 & 실시간 민원 대시보드'}
            {subView === 'categories' && '직관적인 4대 카테고리 선택 UI'}
            {subView === 'form' && '스마트 민원 작성 양식 (익명 스위치 탑재)'}
            {subView === 'timeline' && '투명한 3단계 민원 처리 타임라인'}
          </h2>
        </div>

        {/* Subview pills */}
        <div className="flex items-center gap-1 bg-[#13182b] p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setSubView('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subView === 'dashboard'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            대시보드
          </button>
          <button
            onClick={() => setSubView('categories')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subView === 'categories'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4대 카테고리
          </button>
          <button
            onClick={() => setSubView('form')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subView === 'form'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            민원 신청
          </button>
          <button
            onClick={() => setSubView('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subView === 'timeline'
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            처리 현황
          </button>
        </div>
      </div>

      {/* ========================================================
          1. 신문고 대시보드
         ======================================================== */}
      {subView === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. 민원 신청 카드 */}
            <div
              onClick={() => setSubView('categories')}
              className="bg-white text-slate-800 rounded-3xl p-8 border border-slate-200 hover:border-amber-400 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 m-0">
                  민원 신청
                </h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  학교 시설, 서비스, 기구 개선 요청을 빠르고 간편하게 제출
                </p>
              </div>
              <div className="pt-6 flex items-center text-blue-600 font-bold text-xs gap-1">
                <span>카테고리 선택 후 접수</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* 2. 처리 현황 카드 */}
            <div
              onClick={() => setSubView('timeline')}
              className="bg-white text-slate-800 rounded-3xl p-8 border border-slate-200 hover:border-emerald-400 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 m-0">
                  처리 현황
                </h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  접수된 민원의 실시간 검토 및 해결 단계를 확인
                </p>
              </div>
              <div className="pt-6 flex items-center text-emerald-600 font-bold text-xs gap-1">
                <span>3단계 투명 타임라인 보기</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* 3. 학생 투표 카드 */}
            <div
              onClick={() => setTab('vote')}
              className="bg-white text-slate-800 rounded-3xl p-8 border border-slate-200 hover:border-amber-400 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <Vote className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 m-0">
                  학생 투표
                </h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  학교 생활 규칙 및 안건에 직접 의견을 표현하는 자치 공간
                </p>
              </div>
              <div className="pt-6 flex items-center text-amber-600 font-bold text-xs gap-1">
                <span>투표 아레나로 이동</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick Recent Petition Strip */}
          <div className="bg-[#111628] rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                #
              </div>
              <div>
                <span className="text-xs text-amber-400 font-bold">
                  최근 실시간 접수 민원
                </span>
                <h4 className="text-base font-black text-white m-0">
                  {selectedPetition.title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setSubView('timeline')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors shrink-0"
            >
              실시간 상태 확인하기 →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          2. 4대 카테고리 선택 UI
         ======================================================== */}
      {subView === 'categories' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <button
              onClick={() => setSubView('dashboard')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>신문고 대시보드로 돌아가기</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PETITION_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.title)}
                className="group bg-white text-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200 hover:border-indigo-500 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all cursor-pointer flex flex-col justify-between min-h-[300px]"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed whitespace-pre-line">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col gap-2">
                  <div className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md text-center">
                    평균 처리: {cat.turnaroundTime}
                  </div>
                  <div className="text-center text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                    신청서 작성하기 →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          3. 스마트 민원 작성 양식 (사진 첨부 & 엄격 유효성 검사)
         ======================================================== */}
      {subView === 'form' && (
        <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Back to categories button */}
          <div>
            <button
              onClick={() => setSubView('categories')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-600" />
              <span>카테고리 선택으로 돌아가기</span>
            </button>
          </div>

          {/* Header & Anonymous Switch Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase">
                작성 아이디
              </span>
              <div className="text-base sm:text-lg font-black text-slate-900">
                {isAnonymous
                  ? 'student_2026 (익명 보장 설정)'
                  : `${user.gamerTag} (${user.realName})`}
              </div>
            </div>

            {/* Anonymous Switch Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                {isAnonymous ? <Lock className="w-4 h-4 text-emerald-600" /> : <Unlock className="w-4 h-4 text-slate-400" />}
                익명으로 제출
              </span>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors focus:outline-none ${
                  isAnonymous ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    isAnonymous ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Top Form Error Alert */}
          {errors.general && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Category Indicator */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">
                선택된 카테고리 <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {PETITION_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCat(c.title)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedCat === c.title
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Field: 신청 내용 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                신청 내용 <span className="text-rose-500">* (필수, 올바른 형식 작성)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined, general: undefined }));
                }}
                placeholder="신청 내용을 입력하세요 (예: 2층 모션랩 콘센트 증설 및 의자 교체 건의)"
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none transition-all ${
                  errors.title
                    ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-600 font-bold mt-1">
                  ⚠️ {errors.title}
                </p>
              )}
            </div>

            {/* Field: 신청 사유 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                신청 사유 <span className="text-rose-500">* (필수, 올바른 형식 작성)</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (errors.reason) setErrors((prev) => ({ ...prev, reason: undefined, general: undefined }));
                }}
                placeholder="구체적인 사유를 입력하세요 (예: 노트북 충전 자리가 부족하여 스터디 시 불편함 발생)"
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none transition-all ${
                  errors.reason
                    ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />
              {errors.reason && (
                <p className="text-xs text-rose-600 font-bold mt-1">
                  ⚠️ {errors.reason}
                </p>
              )}
            </div>

            {/* Field: 예상 효과 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                예상 효과 <span className="text-rose-500">* (필수, 올바른 형식 작성)</span>
              </label>
              <input
                type="text"
                value={expectedOutcome}
                onChange={(e) => {
                  setExpectedOutcome(e.target.value);
                  if (errors.expectedOutcome) setErrors((prev) => ({ ...prev, expectedOutcome: undefined, general: undefined }));
                }}
                placeholder="개선 시 기대되는 효과를 입력하세요 (예: 학생들의 실습 학습 몰입도 증대 및 안전사고 예방)"
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none transition-all ${
                  errors.expectedOutcome
                    ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />
              {errors.expectedOutcome && (
                <p className="text-xs text-rose-600 font-bold mt-1">
                  ⚠️ {errors.expectedOutcome}
                </p>
              )}
            </div>

            {/* Field: 기타 참고사항 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                기타 참고사항 <span className="text-rose-500">* (필수, 올바른 형식 작성)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (errors.notes) setErrors((prev) => ({ ...prev, notes: undefined, general: undefined }));
                }}
                placeholder="추가 참고사항을 입력하세요 (예: 사진 첨부 완료, 평일 5교시 이후 발생 등)"
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none transition-all ${
                  errors.notes
                    ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/30'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />
              {errors.notes && (
                <p className="text-xs text-rose-600 font-bold mt-1">
                  ⚠️ {errors.notes}
                </p>
              )}
            </div>

            {/* Actual Real Photo Attachment Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    실제 현장 사진 첨부
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    시설 파손 부위나 현장 사진을 직접 업로드할 수 있습니다 (JPG, PNG).
                  </p>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <span>{photoPreview ? '사진 변경' : '내 컴퓨터에서 사진 첨부'}</span>
                </button>
              </div>

              {/* Photo Preview Card */}
              {photoPreview && (
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={photoPreview}
                      alt="첨부 사진 미리보기"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:opacity-90"
                      onClick={() => setPreviewModalImg(photoPreview)}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 truncate max-w-xs">
                        {photoFileName || '현장 증빙 사진.jpg'}
                      </div>
                      <span className="text-[11px] text-emerald-600 font-bold">
                        ✓ 정상 첨부 완료 (클릭 시 확대)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="첨부 사진 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Notice Callout */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
              <span className="text-base">💡</span>
              <p className="m-0 leading-relaxed font-medium">
                <strong>작성 안내:</strong> 모든 칸은 필수 작성 항목이며, 공백이나 특수문자 단독 작성 시 접수되지 않습니다. 허위/비방 글은 검토 과정에서 반려될 수 있습니다.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setSubView('categories')}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                뒤로가기
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                민원 접수 제출
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          4. 3단계 민원 처리 타임라인 및 신청서 원본 상세 보기
         ======================================================== */}
      {subView === 'timeline' && (
        <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
          {/* Timeline Top Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              onClick={() => setSubView('dashboard')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>신문고 대시보드로 돌아가기</span>
            </button>

            {/* Petition Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs text-slate-400 font-bold shrink-0">
                접수 안건:
              </span>
              {petitions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPetitionId(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedPetition.id === p.id
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.refNumber} - {p.title.slice(0, 14)}...
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold text-slate-500">
                  민원 접수 번호 {selectedPetition.refNumber}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 m-0 mt-0.5">
                  {selectedPetition.title}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 font-black text-xs border border-amber-200 self-start sm:self-auto">
                <span>🛠</span>
                {selectedPetition.statusLabel}
              </span>
            </div>

            {/* Transparent 3-Step Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Step 1: 민원 접수 */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  selectedPetition.step >= 1
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center shadow">
                    ✓
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    접수 완료
                  </span>
                </div>
                <h4 className="text-base font-black m-0 mb-1 text-slate-900">
                  1. 민원 접수
                </h4>
                <p className="text-xs font-semibold text-slate-600 m-0">
                  {selectedPetition.submittedDate}
                </p>
              </div>

              {/* Step 2: 담당 부서 전달 */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  selectedPetition.step === 2
                    ? 'bg-amber-50/90 border-amber-400 text-amber-950 ring-2 ring-amber-400/30'
                    : selectedPetition.step > 2
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow animate-pulse">
                    ⚙️
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    진행 중
                  </span>
                </div>
                <h4 className="text-base font-black m-0 mb-1 text-slate-900">
                  2. 담당 부서 전달
                </h4>
                <p className="text-xs font-semibold text-slate-600 m-0">
                  {selectedPetition.forwardedDate || '행정실 예산 검토 중'}
                </p>
              </div>

              {/* Step 3: 반영 완료 */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  selectedPetition.step >= 3
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 ring-2 ring-emerald-400/30'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-8 h-8 rounded-full text-white font-black text-sm flex items-center justify-center shadow ${
                      selectedPetition.step >= 3 ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    🏁
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                    {selectedPetition.step >= 3 ? '처리 완료' : '예정'}
                  </span>
                </div>
                <h4 className="text-base font-black m-0 mb-1 text-slate-900">
                  3. 반영 완료
                </h4>
                <p className="text-xs font-semibold text-slate-600 m-0">
                  {selectedPetition.completedDate}
                </p>
              </div>
            </div>

            {/* Admin Feedback Box */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                <span>💬</span> 행정실 답변 피드백
              </div>
              <p className="text-sm font-semibold text-slate-800 m-0 italic leading-relaxed">
                "{selectedPetition.adminFeedback}"
              </p>
            </div>
          </div>

          {/* Full Application Document Viewer (그 사람의 민원 신청서 원본 확인 카드) */}
          <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-sm font-black">
                  📄
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 m-0">
                    신청인이 제출한 스마트 민원 신청서 원본
                  </h4>
                  <p className="text-xs text-slate-500 m-0">
                    접수 번호 {selectedPetition.refNumber} · 처리 현황 열람 모드
                  </p>
                </div>
              </div>

              {/* Author ID & Anonymous Tag */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-slate-600">
                  작성 아이디:
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                  {selectedPetition.isAnonymous ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedPetition.authorId}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{selectedPetition.authorId}</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Application Form Readonly Fields */}
            <div className="space-y-4">
              {/* Category */}
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1">
                  접수 카테고리
                </span>
                <div className="inline-block px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                  {selectedPetition.category}
                </div>
              </div>

              {/* Title / Content */}
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1">
                  신청 내용
                </span>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold">
                  {selectedPetition.title}
                </div>
              </div>

              {/* Reason */}
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1">
                  신청 사유
                </span>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium leading-relaxed">
                  {selectedPetition.reason}
                </div>
              </div>

              {/* Expected Outcome */}
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1">
                  예상 효과
                </span>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium leading-relaxed">
                  {selectedPetition.expectedOutcome}
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="block text-xs font-bold text-slate-500 mb-1">
                  기타 참고사항
                </span>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 font-medium">
                  {selectedPetition.notes}
                </div>
              </div>

              {/* Real Attached Photo Viewer in Timeline */}
              {selectedPetition.photoUrl && (
                <div>
                  <span className="block text-xs font-bold text-slate-500 mb-1.5">
                    첨부된 실제 증빙 사진
                  </span>
                  <div className="relative inline-block group">
                    <img
                      src={selectedPetition.photoUrl}
                      alt="신청서 첨부 사진"
                      className="w-48 h-36 object-cover rounded-2xl border-2 border-indigo-200 shadow-md cursor-pointer group-hover:scale-105 transition-transform"
                      onClick={() => setPreviewModalImg(selectedPetition.photoUrl!)}
                    />
                    <div
                      onClick={() => setPreviewModalImg(selectedPetition.photoUrl!)}
                      className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer transition-opacity"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>확대 보기</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Notice */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>✓ 제출된 민원 내용은 학생 자치 규정에 따라 투명하게 관리됩니다.</span>
              <button
                onClick={() => setSubView('dashboard')}
                className="text-indigo-600 font-bold hover:underline"
              >
                신문고 대시보드로 이동 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Photo Zoom */}
      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl p-2 border border-slate-700 shadow-2xl">
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center border border-slate-600 hover:bg-slate-700 shadow"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewModalImg}
              alt="확대 사진"
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
