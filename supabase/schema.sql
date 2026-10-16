-- ========================================================
-- School Log X: Supabase Full Database Schema & Seed Data
-- ========================================================
-- Run this script in the Supabase SQL Editor to set up
-- all tables, RLS policies, storage bucket, and initial data.
-- ========================================================

-- Enable UUID extension if needed
create extension if not exists "uuid-ossp";

-- 1. PROFILES (사용자 프로필)
create table if not exists public.profiles (
  id text primary key,
  gamer_tag text not null,
  real_name text not null,
  bio text,
  avatar_icon text default '👾',
  github_url text,
  blog_url text,
  groups text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. HOBBY POSTS (취미 게시글)
create table if not exists public.hobby_posts (
  id text primary key,
  no text,
  title text not null,
  subtitle text,
  category text not null,
  author text not null,
  author_tag text,
  author_gamer_tag text,
  current_members integer default 0,
  max_members integer default 0,
  likes integer default 0,
  views integer default 0,
  description text,
  interactive_demo_type text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. POST LIKES (게시글 추천 중복 방지 - 1인 1추천)
create table if not exists public.post_likes (
  id serial primary key,
  post_id text references public.hobby_posts(id) on delete cascade,
  user_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(post_id, user_id)
);

-- 4. POST COMMENTS (게시글 댓글)
create table if not exists public.post_comments (
  id text primary key,
  post_id text references public.hobby_posts(id) on delete cascade,
  author text not null,
  content text not null,
  timestamp text not null,
  is_host boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. QUESTS (취미 공유 소모임 파티)
create table if not exists public.quests (
  id text primary key,
  category text not null,
  title text not null,
  description text not null,
  location_and_time text not null,
  current_count integer default 1,
  max_count integer default 6,
  status text default 'recruiting',
  d_day text default 'D-7',
  leader text not null,
  members text[] default '{}',
  tags text[] default '{}',
  requirements text,
  activity_plan text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. PETITIONS (학생 신문고 민원 신청)
create table if not exists public.petitions (
  id text primary key,
  ref_number text not null,
  title text not null,
  category text not null,
  author_id text not null,
  is_anonymous boolean default false,
  reason text not null,
  expected_outcome text not null,
  notes text,
  photo_url text,
  step integer default 1,
  status_label text default '접수 완료',
  submitted_date text default '방금 전 접수됨',
  forwarded_date text default '부서 배정 대기 중',
  completed_date text default '예정일 산정 중',
  admin_feedback text default '학생 신문고에 정상 접수되었습니다.',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. VOTES (투표 아레나 안건)
create table if not exists public.votes (
  id text primary key,
  title text not null,
  category text not null,
  description text,
  d_day text default 'D-3',
  is_hot boolean default false,
  total_votes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. VOTE OPTIONS (투표 선택지)
create table if not exists public.vote_options (
  id text primary key,
  vote_id text references public.votes(id) on delete cascade,
  label text not null,
  votes integer default 0,
  percent integer default 0
);

-- 9. USER VOTES (1인 1투표 제한)
create table if not exists public.user_votes (
  id serial primary key,
  vote_id text references public.votes(id) on delete cascade,
  user_id text not null,
  option_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(vote_id, user_id)
);

-- ========================================================
-- Row Level Security (RLS) Policies (Public Access for Demo)
-- ========================================================
alter table public.profiles enable row level security;
alter table public.hobby_posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.quests enable row level security;
alter table public.petitions enable row level security;
alter table public.votes enable row level security;
alter table public.vote_options enable row level security;
alter table public.user_votes enable row level security;

-- Create Open Policies (Demo friendly)
create policy "Allow all operations on profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all operations on hobby_posts" on public.hobby_posts for all using (true) with check (true);
create policy "Allow all operations on post_likes" on public.post_likes for all using (true) with check (true);
create policy "Allow all operations on post_comments" on public.post_comments for all using (true) with check (true);
create policy "Allow all operations on quests" on public.quests for all using (true) with check (true);
create policy "Allow all operations on petitions" on public.petitions for all using (true) with check (true);
create policy "Allow all operations on votes" on public.votes for all using (true) with check (true);
create policy "Allow all operations on vote_options" on public.vote_options for all using (true) with check (true);
create policy "Allow all operations on user_votes" on public.user_votes for all using (true) with check (true);

-- ========================================================
-- Supabase Storage Bucket for Petition Photos
-- ========================================================
insert into storage.buckets (id, name, public)
values ('petition-photos', 'petition-photos', true)
on conflict (id) do nothing;

create policy "Public Access to petition-photos" on storage.objects
  for select using (bucket_id = 'petition-photos');

create policy "Allow Upload to petition-photos" on storage.objects
  for insert with check (bucket_id = 'petition-photos');

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- Profile Seed
insert into public.profiles (id, gamer_tag, real_name, bio, avatar_icon, github_url, blog_url, groups)
values (
  'user-01',
  '알고리즘왕',
  '이효빈',
  '매일 성실하게 코딩하고 앱을 기록하는 중입니다.',
  '👾',
  'github.com/hyobin-dev',
  'hyobin-blog.me',
  array['🚀 앱개발 동아리', '⚽ 주말 축구부', '📚 알고리즘 스터디']
) on conflict (id) do nothing;

-- Hobby Posts Seed
insert into public.hobby_posts (id, no, title, subtitle, category, author, author_tag, author_gamer_tag, current_members, max_members, likes, views, description, interactive_demo_type, tags, created_at)
values
(
  'post-hero',
  'NO.01',
  'School Log X',
  '학생 주도형 게임화 학교 생활 플랫폼',
  'IT & 코딩',
  '이효빈',
  'hyobin',
  '알고리즘왕 · hyobin',
  4,
  6,
  42,
  256,
  'School Log X는 학생들의 활발한 취미 공유와 자치 활동을 위해 제작된 사이버펑크 네온 감성의 게임화 플랫폼입니다.',
  'canvas-art',
  array['#앱개발', '#사이드프로젝트', '#게이미피케이션'],
  now() - interval '2 days'
),
(
  'post-03',
  'NO.02',
  '인터랙티브 웹 아트 & 모션 그래픽',
  '캔버스 파티클 실시간 렌더링',
  '예술',
  '독스프',
  'kej',
  '독스프 · kej',
  2,
  4,
  35,
  142,
  'HTML5 Canvas 2D 컨텍스트와 마우스 인터랙션을 결합한 실험적인 디지털 아트입니다.',
  'canvas-art',
  array['#디지털아트', '#인터랙티브', '#웹GL'],
  now() - interval '1 day'
),
(
  'post-01',
  'NO.04',
  '작곡할 사람',
  '???: 아 작곡하기 싫다',
  '예술',
  '메타몽',
  'shy',
  '메타몽 · shy',
  3,
  5,
  19,
  84,
  '로파이(Lo-Fi) 비트 같이 찍을 비트메이커 구합니다. 신디사이저나 베이스 다루시는 분 환영!',
  'sound-beat',
  array['#작곡', '#LoFi', '#비트메이커'],
  now() - interval '12 hours'
),
(
  'post-02',
  'NO.05',
  '노래방 갈사람',
  '돌고래 모음집',
  '라이프 스타일',
  'AE',
  'lsy',
  'AE · lsy',
  4,
  4,
  27,
  112,
  '시험 끝나고 금요일 5시에 학교 앞 코인노래방 정모 가실 분! 고음 종결자 모집합니다.',
  'game-pad',
  array['#코노', '#스트레스해소', '#노래방'],
  now() - interval '8 hours'
) on conflict (id) do nothing;

-- Comments Seed
insert into public.post_comments (id, post_id, author, content, timestamp, is_host)
values
('c-1', 'post-hero', '알고리즘왕 (이효빈)', '색감이 정말 사이버틱하고 예쁘네요! 배경으로 쓰고 싶어요.', '10분 전', false),
('c-2', 'post-hero', '메타몽 · shy', '인터랙티브 데모 클릭해보니 반응형 파티클 미쳤습니다 ㄷㄷ', '25분 전', false),
('c-3', 'post-01', '독스프 · kej', '앨범 아트워크 디자인 필요하시면 연락주세요!', '1시간 전', false)
on conflict (id) do nothing;

-- Quests Seed
insert into public.quests (id, category, title, description, location_and_time, current_count, max_count, status, d_day, leader, members, tags, requirements, activity_plan, icon)
values
(
  'quest-01',
  'IT & 코딩',
  '주말 코딩 사이드 프로젝트 팀원 모집',
  '모바일 앱 또는 웹 서비스를 직접 기획하고 배포까지 해보는 실전 사이드 프로젝트 팀입니다! 프론트엔드/백엔드/디자인 열정 있으신 분 누구나 환영합니다.',
  '모션랩 2층 / 매주 수요일 방과후',
  4,
  6,
  'recruiting',
  'D-2',
  '이효빈(파티장)',
  array['김민수', '박서준', '이지은'],
  array['#React', '#TypeScript', '#협업'],
  '기초 코딩 지식 환영, 끝까지 완주할 성실함',
  '1주차 기획 회의 -> 2주차 UI 프로토타입 -> 3주차 기능 개발 -> 4주차 배포 및 데모데이',
  '💻'
),
(
  'quest-02',
  '예술',
  '3D 모델링 & 블렌더 기초 스터디 크루',
  '블렌더(Blender)를 처음 만지는 초보부터 나만의 3D 굿즈나 게임 에셋을 만들고 싶은 분들을 위한 방과후 스터디입니다.',
  '멀티미디어실 102호 / 매주 화,목 점심시간',
  3,
  5,
  'recruiting',
  'D-4',
  '독스프(파티장)',
  array['송지아', '정다은'],
  array['#Blender', '#3D아트', '#디자인'],
  '개인 노트북 또는 실습실 PC 사용 가능자',
  '기초 조형 렌더링 실습 및 개별 캐릭터 모델링 완성',
  '🎨'
),
(
  'quest-03',
  '스포츠',
  '방과후 풋살 & 농구 픽업 매치 동아리',
  '수업 끝나고 땀 흘리며 스트레스 풀 사람 모여라! 매주 정기 풋살/농구 매치를 진행하며 친목을 다집니다.',
  '대운동장 풋살장 / 매주 금요일 방과후 5시',
  8,
  12,
  'recruiting',
  'D-1',
  '강태풍(파티장)',
  array['최준혁', '윤도현', '한수호', '배진우', '이시우', '김하람', '장우진'],
  array['#풋살', '#운동', '#친목'],
  '편한 운동복과 운동화 지참',
  '팀 편성 후 20분 4쿼터 미니 풋살 리그전 진행',
  '⚽'
),
(
  'quest-04',
  '라이프 스타일',
  '심야 독서 북클럽 & 조용한 모각코',
  '시험 기간 전 도서관에서 함께 집중하며 책을 읽거나 각자 공부하는 차분한 자기계발 소모임입니다.',
  '도서관 3층 세미나실 B / 화요일 저녁 6시',
  2,
  6,
  'recruiting',
  'D-5',
  '문학소녀(파티장)',
  array['서유진'],
  array['#독서', '#모각코', '#집중'],
  '읽고 싶은 책 1권 또는 공부할 노트북 지참',
  '50분 집중 몰입 -> 10분 독서 소감 및 근황 공유 티타임',
  '📚'
),
(
  'quest-05',
  'IT & 코딩',
  '발로란트 교내 대항전 5인 스크림 파티',
  '교내 가을 e스포츠 축제 출전을 목표로 주 2회 팀 합을 맞추는 발로란트 5인 팀원을 모집합니다!',
  '온라인 디스코드 채널 / 월, 수 밤 8시',
  4,
  5,
  'recruiting',
  'D-3',
  '조준점장인(파티장)',
  array['오민석', '황도윤', '권민우'],
  array['#발로란트', '#e스포츠', '#스크림'],
  '골드 이상 티어, 보이스 챗 마이크 가능자',
  '맵별 택틱 브리핑 15분 -> 실전 스크림 2경기 진행',
  '🎮'
) on conflict (id) do nothing;

-- Petitions Seed
insert into public.petitions (id, ref_number, title, category, author_id, is_anonymous, reason, expected_outcome, notes, step, status_label, submitted_date, forwarded_date, completed_date, admin_feedback)
values
(
  'pet-01',
  '#2026-089',
  '도서관 학습실 환기 시스템 점검 및 공기청정기 필터 교체',
  'facility',
  '알고리즘왕',
  false,
  '시험 기간 장시간 학습 시 환기 부족으로 인한 두통 및 집중력 저하가 지속되고 있습니다.',
  '쾌적한 실내 공기질 유지 및 학생들의 건강한 학습 환경 개선',
  '창문 환기 안내문 및 에어필터 점검 일정 공지 요청',
  2,
  '부서 배정 완료',
  '2026-10-06 접수됨',
  '2026-10-07 시설관리부 배정',
  '2026-10-12 완료 예정',
  '시설관리팀에 전달되어 금주 목요일 필터 전면 교체 및 공기순환기 가동 점검이 확정되었습니다.'
),
(
  'pet-02',
  '#2026-090',
  '중앙 복도 디스플레이 게시판 동아리 홍보 슬롯 확대',
  'it',
  '독스프',
  false,
  '현재 3개 동아리만 순환되어 신규 개설 소모임의 홍보 기회가 매우 제한적입니다.',
  '다양한 자율 동아리 및 스터디 활동 활성화',
  'QR코드를 통한 모바일 연동 지원 요청',
  1,
  '접수 완료',
  '2026-10-07 접수됨',
  '학생지원과 검토 중',
  '예정일 산정 중',
  '신규 동아리 등록 현황을 파악 후 10월 둘째 주 게시 기준표를 공지할 예정입니다.'
),
(
  'pet-03',
  '#2026-088',
  '체육관 농구장 골대 그물 교체 및 라인 재도색 완료',
  'facility',
  'student_2026 (익명)',
  true,
  '농구대 그물이 찢어져 공이 튀어나가고 라인이 흐려 경기 진행 시 판정 시비가 발생했습니다.',
  '원활한 체육 수업 및 방과 후 교내 풋살/농구 리그 운영',
  '체육부장 서명 첨부',
  3,
  '처리 완료',
  '2026-09-28 접수됨',
  '2026-09-29 시설팀 전달',
  '2026-10-03 작업 완료',
  '그물 전면 신규 교체 및 친환경 우레탄 라인 재도색을 모두 마쳤습니다. 쾌적하게 이용 바랍니다.'
) on conflict (id) do nothing;

-- Votes Seed
insert into public.votes (id, title, category, description, d_day, is_hot, total_votes)
values
(
  'vote-01',
  '가을 축제 E-Sports 종목: 발로란트 vs 롤(LoL)',
  '학생회 자치',
  '올해 교내 가을 대동제 메인 e스포츠 종목 선정을 위한 전교생 투표입니다.',
  'D-1',
  true,
  420
),
(
  'vote-02',
  '중간고사 시험 기간 도서관 24시간 자율 개방안',
  '학습 환경',
  '자율학습 희망 학생들을 위한 무인 스마트 입출결 기반 24시간 개방 시범 운영 안건입니다.',
  'D-4',
  false,
  310
) on conflict (id) do nothing;

-- Vote Options Seed
insert into public.vote_options (id, vote_id, label, votes, percent)
values
('v1-opt-1', 'vote-01', '발로란트 (5인 1팀 교내 리그전)', 260, 62),
('v1-opt-2', 'vote-01', '리그 오브 레전드 (소환사의 협곡)', 160, 38),
('v2-opt-1', 'vote-02', '찬성 (시험 2주 전부터 심야 개방)', 248, 80),
('v2-opt-2', 'vote-02', '반대 (기존 자정 마감 유지 및 안전 우선)', 62, 20)
on conflict (id) do nothing;
