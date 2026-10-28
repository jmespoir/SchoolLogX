export type MainTab = 'home' | 'hobby' | 'quest' | 'profile' | 'petition' | 'vote' | 'timetable';

export interface UserProfile {
  id: string;
  gamerTag: string;
  realName: string;
  bio: string;
  avatarIcon: string;
  githubUrl: string;
  blogUrl: string;
  groups: string[];
}

export interface HobbyCategory {
  id: string;
  name: string;
  tagline: string;
  postCount: number;
  topPostTitle: string;
  topPostLikes: number;
  iconName: string;
  accentColor: string;
}

export interface HobbyPost {
  id: string;
  no: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  authorTag: string;
  authorGamerTag: string;
  currentMembers?: number;
  maxMembers?: number;
  likes: number;
  views: number;
  createdAt: string;
  description: string;
  interactiveDemoType?: 'canvas-art' | 'sound-beat' | 'game-pad';
  tags: string[];
  comments: CommentItem[];
}

export interface CommentItem {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isHost?: boolean;
}

export interface QuestParty {
  id: string;
  category: string;
  title: string;
  description: string;
  locationAndTime: string;
  currentCount: number;
  maxCount: number;
  status: 'recruiting' | 'closed';
  dDay: string;
  leader: string;
  members: string[];
  tags: string[];
  requirements?: string;
  activityPlan?: string;
  icon?: string;
}

export interface PetitionCategory {
  id: string;
  title: string;
  description: string;
  turnaroundTime: string;
  icon: string;
}

export type PetitionStep = 1 | 2 | 3;

export interface PetitionItem {
  id: string;
  refNumber: string;
  title: string;
  category: string;
  authorId: string;
  isAnonymous: boolean;
  reason: string;
  expectedOutcome: string;
  notes: string;
  photoUrl?: string;
  step: PetitionStep;
  statusLabel: string;
  submittedDate: string;
  forwardedDate?: string;
  completedDate?: string;
  adminFeedback?: string;
}

export interface VoteCandidate {
  id: string;
  name: string;
  subtitle?: string;
  votes: number;
}

export interface VoteTopic {
  id: string;
  numberTag: string;
  isHot: boolean;
  title: string;
  statusText: string;
  remainingTime: string;
  options: [VoteCandidate, VoteCandidate]; // 찬반 2선지
  userVotedOptionId?: string;
}

export interface TimetableCell {
  id: string;
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
  dayLabel: string;
  period: number;
  subject: string;
  location?: string;
  items?: string;
  questTitle?: string;
  questDeadline?: string;
  hasAssignment?: boolean;
  hasPreparation?: boolean;
  isCompleted?: boolean;
}
