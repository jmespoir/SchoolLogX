import type {
  UserProfile,
  HobbyCategory,
  HobbyPost,
  QuestParty,
  PetitionCategory,
  PetitionItem,
  VoteTopic,
  TimetableCell
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'user-01',
  gamerTag: '알고리즘왕',
  realName: '이효빈',
  bio: '매일 성실하게 코딩하고 앱을 기록하는 중입니다.',
  avatarIcon: '👾',
  githubUrl: 'github.com/hyobin-dev',
  blogUrl: 'hyobin-blog.me',
  groups: ['🚀 앱개발 동아리', '⚽ 주말 축구부', '📚 알고리즘 스터디']
};

export const INITIAL_CATEGORIES: HobbyCategory[] = [
  {
    id: 'art',
    name: '예술',
    tagline: '만들어라',
    postCount: 38,
    topPostTitle: 'School Log X (추천 42회)',
    topPostLikes: 42,
    iconName: 'Palette',
    accentColor: 'from-pink-500/20 to-purple-500/10 border-pink-500/30 text-pink-400'
  },
  {
    id: 'sports',
    name: '스포츠',
    tagline: '움직여라',
    postCount: 29,
    topPostTitle: '풋살 리그 원정팀 모집 (추천 35회)',
    topPostLikes: 35,
    iconName: 'Trophy',
    accentColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400'
  },
  {
    id: 'literature',
    name: '문학',
    tagline: '읽어라',
    postCount: 19,
    topPostTitle: '심야 독서 북클럽 1기 (추천 28회)',
    topPostLikes: 28,
    iconName: 'BookOpen',
    accentColor: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400'
  },
  {
    id: 'lifestyle',
    name: '라이프 스타일',
    tagline: '함께 보자',
    postCount: 44,
    topPostTitle: '모션랩 데스크 셋업 자랑 (추천 51회)',
    topPostLikes: 51,
    iconName: 'Sparkles',
    accentColor: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400'
  },
  {
    id: 'tech',
    name: 'IT & 게임',
    tagline: '코딩하고 즐겨라',
    postCount: 52,
    topPostTitle: '게임 잼 48시간 해커톤 후기 (추천 64회)',
    topPostLikes: 64,
    iconName: 'Gamepad2',
    accentColor: 'from-indigo-500/20 to-violet-500/10 border-indigo-500/30 text-indigo-400'
  }
];

export const INITIAL_POSTS: HobbyPost[] = [
  {
    id: 'post-03',
    no: 'NO.06',
    title: '내 그림 쩔죠',
    subtitle: '피카소 나와',
    category: '예술',
    author: '독스프',
    authorTag: 'kej',
    authorGamerTag: '독스프 · kej',
    likes: 12,
    views: 38,
    createdAt: '2026-10-06',
    description: '며칠동안 열심히 그렸는데… 왜 성취감보다 머리가 아프냐 🎨 창작의 고통 끝에 완성한 인터랙티브 그래픽입니다!',
    interactiveDemoType: 'canvas-art',
    tags: ['#디지털드로잉', '#일러스트', '#창작의고통'],
    comments: [
      {
        id: 'c-1',
        author: '알고리즘왕 (이효빈)',
        content: '색감이 정말 사이버틱하고 예쁘네요! 배경으로 쓰고 싶어요.',
        timestamp: '10분 전'
      },
      {
        id: 'c-2',
        author: '메타몽 · shy',
        content: '인터랙티브 데모 클릭해보니 반응형 파티클 미쳤습니다 ㄷㄷ',
        timestamp: '25분 전'
      }
    ]
  },
  {
    id: 'post-01',
    no: 'NO.04',
    title: '작곡할 사람',
    subtitle: '???: 아 작곡하기 싫다',
    category: '예술',
    author: '메타몽',
    authorTag: 'shy',
    authorGamerTag: '메타몽 · shy',
    currentMembers: 3,
    maxMembers: 5,
    likes: 19,
    views: 84,
    createdAt: '2026-10-05',
    description: '로파이(Lo-Fi) 비트 같이 찍을 비트메이커 구합니다. 신디사이저나 베이스 다루시는 분 환영!',
    interactiveDemoType: 'sound-beat',
    tags: ['#작곡', '#LoFi', '#비트메이커'],
    comments: [
      {
        id: 'c-3',
        author: '독스프 · kej',
        content: '앨범 아트워크 디자인 필요하시면 연락주세요!',
        timestamp: '1시간 전'
      }
    ]
  },
  {
    id: 'post-02',
    no: 'NO.05',
    title: '노래방 갈사람',
    subtitle: '돌고래 모음집',
    category: '라이프 스타일',
    author: 'AE',
    authorTag: 'lsy',
    authorGamerTag: 'AE · lsy',
    currentMembers: 4,
    maxMembers: 4,
    likes: 27,
    views: 112,
    createdAt: '2026-10-05',
    description: '시험 끝나고 금요일 5시에 학교 앞 코인노래방 정모 가실 분! 고음 종결자 모집합니다.',
    interactiveDemoType: 'game-pad',
    tags: ['#코노', '#스트레스해소', '#노래방'],
    comments: []
  }
];

export const INITIAL_QUESTS: QuestParty[] = [
  {
    id: 'quest-01',
    category: 'IT & 코딩',
    title: '주말 코딩 사이드 프로젝트 팀원 모집',
    description: '모바일 앱 또는 웹 서비스를 직접 기획하고 배포까지 해보는 실전 사이드 프로젝트 팀입니다! 프론트엔드/백엔드/디자인 열정 있으신 분 누구나 환영합니다.',
    locationAndTime: '모션랩 2층 / 매주 수요일 방과후',
    currentCount: 4,
    maxCount: 6,
    status: 'recruiting',
    dDay: 'D-2',
    leader: '이효빈(파티장)',
    members: ['김민수', '박서준', '이지은'],
    tags: ['#React', '#TypeScript', '#협업'],
    requirements: '기초 코딩 지식 환영, 끝까지 완주할 성실함',
    activityPlan: '1주차 기획 회의 -> 2주차 UI 프로토타입 -> 3주차 기능 개발 -> 4주차 배포 및 데모데이',
    icon: '💻'
  },
  {
    id: 'quest-02',
    category: '예술',
    title: '3D 모델링 & 블렌더 기초 스터디 크루',
    description: '블렌더(Blender)를 처음 만지는 초보부터 나만의 3D 굿즈나 게임 에셋을 만들고 싶은 분들을 위한 방과후 스터디입니다.',
    locationAndTime: '멀티미디어실 102호 / 매주 화,목 점심시간',
    currentCount: 3,
    maxCount: 5,
    status: 'recruiting',
    dDay: 'D-4',
    leader: '독스프(파티장)',
    members: ['송지아', '정다은'],
    tags: ['#Blender', '#3D아트', '#디자인'],
    requirements: '개인 노트북 또는 실습실 PC 사용 가능자',
    activityPlan: '기초 조형 렌더링 실습 및 개별 캐릭터 모델링 완성',
    icon: '🎨'
  },
  {
    id: 'quest-03',
    category: '스포츠',
    title: '방과후 풋살 & 농구 픽업 매치 동아리',
    description: '수업 끝나고 땀 흘리며 스트레스 풀 사람 모여라! 매주 정기 풋살/농구 매치를 진행하며 친목을 다집니다.',
    locationAndTime: '대운동장 풋살장 / 매주 금요일 방과후 5시',
    currentCount: 8,
    maxCount: 12,
    status: 'recruiting',
    dDay: 'D-1',
    leader: '강태풍(파티장)',
    members: ['최준혁', '윤도현', '한수호', '배진우', '이시우', '김하람', '장우진'],
    tags: ['#풋살', '#운동', '#친목'],
    requirements: '편한 운동복과 운동화 지참',
    activityPlan: '팀 편성 후 20분 4쿼터 미니 풋살 리그전 진행',
    icon: '⚽'
  },
  {
    id: 'quest-04',
    category: '라이프 스타일',
    title: '심야 독서 북클럽 & 조용한 모각코',
    description: '시험 기간 전 도서관에서 함께 집중하며 책을 읽거나 각자 공부하는 차분한 자기계발 소모임입니다.',
    locationAndTime: '도서관 3층 세미나실 B / 화요일 저녁 6시',
    currentCount: 2,
    maxCount: 6,
    status: 'recruiting',
    dDay: 'D-5',
    leader: '문학소녀(파티장)',
    members: ['서유진'],
    tags: ['#독서', '#모각코', '#집중'],
    requirements: '읽고 싶은 책 1권 또는 공부할 노트북 지참',
    activityPlan: '50분 집중 몰입 -> 10분 독서 소감 및 근황 공유 티타임',
    icon: '📚'
  },
  {
    id: 'quest-05',
    category: 'IT & 코딩',
    title: '발로란트 교내 대항전 5인 스크림 파티',
    description: '교내 가을 e스포츠 축제 출전을 목표로 주 2회 팀 합을 맞추는 발로란트 5인 팀원을 모집합니다!',
    locationAndTime: '온라인 디스코드 채널 / 월, 수 밤 8시',
    currentCount: 4,
    maxCount: 5,
    status: 'recruiting',
    dDay: 'D-3',
    leader: '조준점장인(파티장)',
    members: ['오민석', '황도윤', '권민우'],
    tags: ['#발로란트', '#e스포츠', '#스크림'],
    requirements: '골드 이상 티어, 보이스 챗 마이크 가능자',
    activityPlan: '맵별 택틱 브리핑 15분 -> 실전 스크림 2경기 진행',
    icon: '🎮'
  }
];

export const INITIAL_QUEST: QuestParty = INITIAL_QUESTS[0];

export const PETITION_CATEGORIES: PetitionCategory[] = [
  {
    id: 'facility',
    title: '학교 설비',
    description: '화장실 휴지 보충, 냉난방기 점검, 세면대 수리 요청',
    turnaroundTime: '24시간 이내',
    icon: 'Wrench'
  },
  {
    id: 'service',
    title: '학교 서비스',
    description: '도서관 대여 시스템, 수업지원실 기자재 지원 건의',
    turnaroundTime: '48시간 이내',
    icon: 'Headphones'
  },
  {
    id: 'campus',
    title: '학교 시설',
    description: '모션 랩 장비 교체, 체육관 기구 및 강당 대여',
    turnaroundTime: '3일 이내',
    icon: 'Building2'
  },
  {
    id: 'etc',
    title: '기타 민원',
    description: '기타 교내 생활 불편 사항 및 자유로운 제안',
    turnaroundTime: '수시 확인 및 반영',
    icon: 'MessageSquareText'
  }
];

export const INITIAL_PETITIONS: PetitionItem[] = [
  {
    id: 'pet-01',
    refNumber: '#2026-084',
    title: '2층 모션랩 콘센트 증설 및 의자 교체 요청',
    category: '학교 시설',
    authorId: 'student_2026',
    isAnonymous: true,
    reason: '노트북 충전 자리가 부족하여 스터디 시 불편함 발생',
    expectedOutcome: '학생들의 실습 학습 몰입도 증대 및 안전사고 예방',
    notes: '사진 첨부 완료 (의자 파손 부위 2장)',
    step: 2,
    statusLabel: '검토 및 조치 중',
    submittedDate: '09월 12일 완료',
    forwardedDate: '행정실 예산 검토 중',
    completedDate: '09월 20일 완료 예정',
    adminFeedback: '학생들의 의견을 수렴하여 오는 수요일 점검 시 멀티탭 수량을 추가 배치할 예정입니다.'
  },
  {
    id: 'pet-02',
    refNumber: '#2026-085',
    title: '3층 컴퓨터실 에어컨 필터 청소 요청',
    category: '학교 설비',
    authorId: 'student_2024',
    isAnonymous: false,
    reason: '환기가 잘 안 되고 냄새가 발생함',
    expectedOutcome: '쾌적한 실습 환경 조성',
    notes: '방과후 상시 사용 구역',
    step: 3,
    statusLabel: '반영 완료',
    submittedDate: '09월 10일 완료',
    forwardedDate: '시설관리팀 배정 완료',
    completedDate: '09월 14일 처리 완료',
    adminFeedback: '전문 세척 업체를 통해 컴퓨터실 3개 구역 에어컨 필터 및 송풍구 청소를 마쳤습니다.'
  }
];

export const INITIAL_VOTES: VoteTopic[] = [
  {
    id: 'vote-01',
    numberTag: '안건 #01',
    isHot: true,
    title: '시험 기간 도서관 24시간 개방 안건',
    statusText: '진행중',
    remainingTime: '14시간 20분',
    options: [
      {
        id: 'opt-1-agree',
        name: '선지 1: 찬성 (연장 개방)',
        subtitle: '연장 개방 찬성',
        votes: 163
      },
      {
        id: 'opt-1-disagree',
        name: '선지 2: 반대 (기존 유지)',
        subtitle: '기존 운영 유지',
        votes: 77
      }
    ]
  },
  {
    id: 'vote-02',
    numberTag: '안건 #02',
    isHot: false,
    title: '가을 체육대회 신규 종목 추가 선호도 조사',
    statusText: '진행중',
    remainingTime: 'D-3 남음',
    options: [
      {
        id: 'opt-2-esports',
        name: '선지 1: e스포츠 대회 신설 (리그 오브 레전드 / 발로란트)',
        votes: 142
      },
      {
        id: 'opt-2-outdoor',
        name: '선지 2: 야외 구기 종목 확대 (피구 / 농구 토너먼트)',
        votes: 89
      }
    ]
  },
  {
    id: 'vote-03',
    numberTag: '안건 #03',
    isHot: false,
    title: '금요일 급식 메뉴 자율 선택제 도입 건',
    statusText: '진행중',
    remainingTime: 'D-5 남음',
    options: [
      {
        id: 'opt-3-choice',
        name: '선지 1: 샐러드 & 덮밥 자율 선택 코너 운영',
        votes: 215
      },
      {
        id: 'opt-3-standard',
        name: '선지 2: 기존 단일 식단 정규 배식 유지',
        votes: 41
      }
    ]
  }
];

export const INITIAL_TIMETABLE: TimetableCell[] = (() => {
  const grid = [
    // 1교시
    { day: 'mon', dayLabel: '월요일', period: 1, subject: '국어', location: '본관 2층 1반 교실' },
    { day: 'tue', dayLabel: '화요일', period: 1, subject: '수학', location: '본관 3층 수학 전용 교실', items: '수학 교과서, 삼각자 세트, 검은색 볼펜', questTitle: '교과서 45p ~ 48p 연습문제 풀이', questDeadline: '다음 수업 시간 전까지 제출', hasAssignment: true },
    { day: 'wed', dayLabel: '수요일', period: 1, subject: '영어', location: '어학 실습실 A' },
    { day: 'thu', dayLabel: '목요일', period: 1, subject: '과학', location: '과학 1실 (화학실험실)' },
    { day: 'fri', dayLabel: '금요일', period: 1, subject: '체육', location: '체육관 1층 농구장' },

    // 2교시
    { day: 'mon', dayLabel: '월요일', period: 2, subject: '영어', location: '어학 실습실 B' },
    { day: 'tue', dayLabel: '화요일', period: 2, subject: '미술', location: '창작관 3층 미술실' },
    { day: 'wed', dayLabel: '수요일', period: 2, subject: '국어', location: '본관 2층 1반 교실' },
    { day: 'thu', dayLabel: '목요일', period: 2, subject: '사회', location: '사회 전용 교실' },
    { day: 'fri', dayLabel: '금요일', period: 2, subject: '음악', location: '음악관 2층 합주실' },

    // 3교시
    { day: 'mon', dayLabel: '월요일', period: 3, subject: '수학', location: '본관 2층 1반 교실' },
    { day: 'tue', dayLabel: '화요일', period: 3, subject: '미술', location: '창작관 3층 미술실' },
    { day: 'wed', dayLabel: '수요일', period: 3, subject: '역사', location: '본관 2층 1반 교실' },
    { day: 'thu', dayLabel: '목요일', period: 3, subject: '영어', location: '어학 실습실 A' },
    { day: 'fri', dayLabel: '금요일', period: 3, subject: '국어', location: '본관 2층 1반 교실' },

    // 4교시
    { day: 'mon', dayLabel: '월요일', period: 4, subject: '과학', location: '과학 2실 (물리실험실)' },
    { day: 'tue', dayLabel: '화요일', period: 4, subject: '체육', location: '대운동장 축구장' },
    { day: 'wed', dayLabel: '수요일', period: 4, subject: '도덕', location: '본관 2층 1반 교실' },
    { day: 'thu', dayLabel: '목요일', period: 4, subject: '수학', location: '본관 3층 수학 전용 교실' },
    { day: 'fri', dayLabel: '금요일', period: 4, subject: '영어', location: '어학 실습실 A', items: '영어 교재, 발표 대본, 단어 암기장', hasPreparation: true },

    // 5교시
    { day: 'mon', dayLabel: '월요일', period: 5, subject: '역사', location: '본관 2층 1반 교실' },
    { day: 'tue', dayLabel: '화요일', period: 5, subject: '국어', location: '본관 2층 1반 교실' },
    { day: 'wed', dayLabel: '수요일', period: 5, subject: '수학', location: '본관 3층 수학 전용 교실' },
    { day: 'thu', dayLabel: '목요일', period: 5, subject: '정보', location: '컴퓨터 실습 1실' },
    { day: 'fri', dayLabel: '금요일', period: 5, subject: '창체', location: '본관 2층 1반 교실' },

    // 6교시
    { day: 'mon', dayLabel: '월요일', period: 6, subject: '창체', location: '시청각실' },
    { day: 'tue', dayLabel: '화요일', period: 6, subject: '수학', location: '본관 3층 수학 전용 교실' },
    { day: 'wed', dayLabel: '수요일', period: 6, subject: '과학', location: '과학 3실 (생물실험실)' },
    { day: 'thu', dayLabel: '목요일', period: 6, subject: '자율', location: '본관 2층 1반 교실' },
    { day: 'fri', dayLabel: '금요일', period: 6, subject: '진로', location: '진로상담실' },

    // 7교시
    { day: 'mon', dayLabel: '월요일', period: 7, subject: '-' },
    { day: 'tue', dayLabel: '화요일', period: 7, subject: '-' },
    { day: 'wed', dayLabel: '수요일', period: 7, subject: '동아리', location: '각 동아리 지정 특별실' },
    { day: 'thu', dayLabel: '목요일', period: 7, subject: '-' },
    { day: 'fri', dayLabel: '금요일', period: 7, subject: '-' }
  ];

  return grid.map((c) => ({
    id: `${c.day}-${c.period}`,
    day: c.day as 'mon' | 'tue' | 'wed' | 'thu' | 'fri',
    dayLabel: c.dayLabel,
    period: c.period,
    subject: c.subject,
    originalSubject: c.subject,
    isChanged: false,
    changeReason: '',
    location: c.location || (c.subject === '-' ? '' : '본관 2층 1반 교실'),
    items: c.items || '',
    questTitle: c.questTitle || '',
    questDeadline: c.questDeadline || '',
    hasAssignment: Boolean(c.hasAssignment),
    hasPreparation: Boolean(c.hasPreparation),
    isCompleted: false
  }));
})();
