import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Users,
  Trash2,
  Edit2,
  Check,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Code2,
  ArrowLeft
} from 'lucide-react';

export const ProfileCard: React.FC = () => {
  const { user, updateUser, triggerConfetti, setTab } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [isGroupPublic, setIsGroupPublic] = useState(true);

  // Edit fields
  const [editGamerTag, setEditGamerTag] = useState(user.gamerTag);
  const [editRealName, setEditRealName] = useState(user.realName);
  const [editBio, setEditBio] = useState(user.bio);
  const [editGithub, setEditGithub] = useState(user.githubUrl);
  const [editBlog, setEditBlog] = useState(user.blogUrl);
  const [newGroupTag, setNewGroupTag] = useState('');

  const avatarOptions = ['👾', '🤖', '🦊', '⚡', '🚀', '🧙‍♂️', '🕹️', '🛡️'];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      gamerTag: editGamerTag,
      realName: editRealName,
      bio: editBio,
      githubUrl: editGithub,
      blogUrl: editBlog
    });
    setIsEditing(false);
    triggerConfetti();
  };

  const handleAddGroupTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTag.trim()) return;
    if (user.groups.includes(newGroupTag.trim())) return;

    updateUser({
      groups: [...user.groups, newGroupTag.trim()]
    });
    setNewGroupTag('');
    triggerConfetti();
  };

  const handleRemoveGroupTag = (tagToRemove: string) => {
    updateUser({
      groups: user.groups.filter((g) => g !== tagToRemove)
    });
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
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            학생 게이머태그 & 아이덴티티
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white m-0">
            게이머태그 스타일 프로필 & 커스텀 카드
          </h2>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
            isEditing
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
          }`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          {isEditing ? '수정 취소' : '프로필 편집하기'}
        </button>
      </div>

      {/* Main Gamer Card Canvas */}
      <div className="bg-[#111628] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Banner with Gamer Tag & Pixel Avatar (Wireframe P.6 Top Banner) */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 sm:p-8 relative text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar Badge */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-[#0d111e]/80 border-2 border-white/30 backdrop-blur flex items-center justify-center text-4xl shadow-xl">
                {user.avatarIcon}
              </div>
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 bg-indigo-900 border border-indigo-400 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                  변경
                </div>
              )}
            </div>

            {/* Tag & Bio */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-black text-white m-0 tracking-tight">
                  {user.gamerTag} <span className="text-indigo-200">({user.realName})</span>
                </h3>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white">
                  VERIFIED
                </span>
              </div>
              <p className="text-sm font-medium text-indigo-100/90 italic max-w-xl">
                "{user.bio}"
              </p>
            </div>
          </div>

          {/* Quick Avatar Picker if Editing */}
          {isEditing && (
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-indigo-200 shrink-0">아바타 선택:</span>
              {avatarOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => updateUser({ avatarIcon: icon })}
                  className={`w-9 h-9 rounded-xl bg-white/10 hover:bg-white/30 flex items-center justify-center text-lg transition-transform ${
                    user.avatarIcon === icon ? 'ring-2 ring-white scale-110' : ''
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lower Body: SNS Links & Groups (Wireframe P.6 Lower Half) */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0f1424]">
          {/* Section 1: 🔗 추가 SNS & 깃허브 연동 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-200">
              <LinkIcon className="w-4 h-4 text-cyan-400" />
              <span>추가 SNS & 깃허브 연동</span>
            </div>

            <div className="space-y-3">
              {/* GitHub Link */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-[10px] text-slate-400 font-bold">GitHub</div>
                  <a
                    href={`https://${user.githubUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-bold text-cyan-400 hover:underline truncate block"
                  >
                    {user.githubUrl}
                  </a>
                </div>
              </div>

              {/* Blog Link */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-[10px] text-slate-400 font-bold">Personal Blog</div>
                  <a
                    href={`https://${user.blogUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-bold text-purple-400 hover:underline truncate block"
                  >
                    {user.blogUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 👥 공개 소속 그룹 목록 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-black text-slate-200">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>공개 소속 그룹 목록</span>
              </div>
              <button
                onClick={() => setIsGroupPublic(!isGroupPublic)}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-200"
              >
                {isGroupPublic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {isGroupPublic ? '공개 중' : '비공개'}
              </button>
            </div>

            {isGroupPublic ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2.5">
                  {user.groups.map((group, idx) => (
                    <div
                      key={idx}
                      className="group/tag flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:border-indigo-500/50 transition-colors"
                    >
                      <span>{group}</span>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveGroupTag(group)}
                          className="text-slate-500 hover:text-rose-400 p-0.5 ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new group tag inline */}
                {isEditing && (
                  <form onSubmit={handleAddGroupTag} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newGroupTag}
                      onChange={(e) => setNewGroupTag(e.target.value)}
                      placeholder="새 그룹/동아리 태그 추가 (예: 🎨 웹툰 창작부)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!newGroupTag.trim()}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold"
                    >
                      추가
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-slate-500 text-xs font-bold">
                공개되지 않았습니다.
              </div>
            )}
          </div>
        </div>

        {/* Inline Edit Form Modal / Panel */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="p-6 sm:p-8 border-t border-slate-800 bg-[#0c0f1c] space-y-4"
          >
            <h4 className="text-sm font-black text-cyan-400 m-0">
              ⚙️ 프로필 상세 정보 수정
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  게이머태그 (닉네임)
                </label>
                <input
                  type="text"
                  required
                  value={editGamerTag}
                  onChange={(e) => setEditGamerTag(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  실명 (학생 이름)
                </label>
                <input
                  type="text"
                  required
                  value={editRealName}
                  onChange={(e) => setEditRealName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-bold mb-1">
                  한줄 소개
                </label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  GitHub 링크
                </label>
                <input
                  type="text"
                  value={editGithub}
                  onChange={(e) => setEditGithub(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  블로그 / 포트폴리오 링크
                </label>
                <input
                  type="text"
                  value={editBlog}
                  onChange={(e) => setEditBlog(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <Check className="w-3.5 h-3.5" />
                저장 완료
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
