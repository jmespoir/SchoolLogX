import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  MainTab,
  UserProfile,
  HobbyPost,
  QuestParty,
  PetitionItem,
  VoteTopic
} from '../types';
import {
  INITIAL_USER,
  INITIAL_POSTS,
  INITIAL_QUEST,
  INITIAL_QUESTS,
  INITIAL_PETITIONS,
  INITIAL_VOTES
} from '../data/mockData';
import { SupabaseService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

interface AppContextType {
  tab: MainTab;
  setTab: (tab: MainTab) => void;
  user: UserProfile;
  updateUser: (updater: Partial<UserProfile>) => void;
  
  // Supabase Backend
  isSupabaseConnected: boolean;
  isLoadingBackend: boolean;
  refreshFromBackend: () => Promise<void>;

  // Hobby
  posts: HobbyPost[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedPost: HobbyPost | null;
  setSelectedPost: (post: HobbyPost | null) => void;
  addPost: (post: Omit<HobbyPost, 'id' | 'likes' | 'views' | 'createdAt' | 'comments'>) => void;
  likedPostIds: string[];
  hasLikedPost: (id: string) => boolean;
  toggleLikePost: (id: string) => void;
  likePost: (id: string) => void;
  addComment: (postId: string, content: string) => void;

  // Quest (소모임 모집)
  quests: QuestParty[];
  quest: QuestParty;
  selectedQuestCategory: string | null;
  setSelectedQuestCategory: (cat: string | null) => void;
  selectedQuest: QuestParty | null;
  setSelectedQuest: (quest: QuestParty | null) => void;
  joinQuest: (questId?: string) => void;
  leaveQuest: (questId?: string) => void;
  addQuest: (newQuest: Omit<QuestParty, 'id' | 'currentCount' | 'members' | 'status'>) => void;
  updateQuestForm: (title: string, locationAndTime: string, maxCount: number) => void;

  // Petition (신문고)
  petitions: PetitionItem[];
  selectedPetition: PetitionItem;
  setSelectedPetitionId: (id: string) => void;
  selectedPetitionCategory: string | null;
  setSelectedPetitionCategory: (catId: string | null) => void;
  addPetition: (data: {
    title: string;
    category: string;
    isAnonymous: boolean;
    reason: string;
    expectedOutcome: string;
    notes: string;
    photoUrl?: string;
  }) => void;

  // Vote (투표 아레나)
  votes: VoteTopic[];
  selectedVote: VoteTopic;
  setSelectedVoteId: (id: string) => void;
  castVote: (topicId: string, optionId: string) => boolean;
  updateVoteTopic: (topicId: string, title: string, opt1Name: string, opt2Name: string) => void;
  createVoteTopic: (title: string, opt1Name: string, opt2Name: string, remainingTime?: string) => void;

  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tab, setTab] = useState<MainTab>('home');

  // Supabase Connection State
  const [isSupabaseConnected] = useState<boolean>(SupabaseService.isConfigured());
  const [isLoadingBackend, setIsLoadingBackend] = useState<boolean>(false);

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('slx_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Hobby Posts
  const [posts, setPosts] = useState<HobbyPost[]>(() => {
    const saved = localStorage.getItem('slx_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<HobbyPost | null>(null);

  // Liked Posts
  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('slx_liked_posts');
    return saved ? JSON.parse(saved) : [];
  });

  // Quests (소모임)
  const [quests, setQuests] = useState<QuestParty[]>(() => {
    const saved = localStorage.getItem('slx_quests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_QUESTS;
  });
  const [selectedQuestCategory, setSelectedQuestCategory] = useState<string | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<QuestParty | null>(null);

  const quest = quests[0] || INITIAL_QUEST;

  // Petition
  const [petitions, setPetitions] = useState<PetitionItem[]>(() => {
    const saved = localStorage.getItem('slx_petitions');
    return saved ? JSON.parse(saved) : INITIAL_PETITIONS;
  });
  const [selectedPetitionId, setSelectedPetitionId] = useState<string>('pet-01');
  const [selectedPetitionCategory, setSelectedPetitionCategory] = useState<string | null>(null);

  // Vote
  const [votes, setVotes] = useState<VoteTopic[]>(() => {
    const saved = localStorage.getItem('slx_votes');
    return saved ? JSON.parse(saved) : INITIAL_VOTES;
  });
  const [selectedVoteId, setSelectedVoteId] = useState<string>('vote-01');

  // Persistence to LocalStorage (as cache and fallback)
  useEffect(() => {
    localStorage.setItem('slx_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('slx_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('slx_liked_posts', JSON.stringify(likedPostIds));
  }, [likedPostIds]);

  useEffect(() => {
    localStorage.setItem('slx_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('slx_petitions', JSON.stringify(petitions));
  }, [petitions]);

  useEffect(() => {
    localStorage.setItem('slx_votes', JSON.stringify(votes));
  }, [votes]);

  // Initial Sync from Supabase Backend
  const refreshFromBackend = async () => {
    if (!SupabaseService.isConfigured()) return;
    setIsLoadingBackend(true);
    try {
      const [backendPosts, backendQuests, backendPetitions, backendVotes, backendLikedPostIds, backendProfile] =
        await Promise.all([
          SupabaseService.fetchPosts(),
          SupabaseService.fetchQuests(),
          SupabaseService.fetchPetitions(),
          SupabaseService.fetchVotes(user.id),
          SupabaseService.fetchLikedPostIds(user.id),
          SupabaseService.fetchProfile(user.id)
        ]);

      if (backendPosts.length > 0) setPosts(backendPosts);
      if (backendQuests.length > 0) setQuests(backendQuests);
      if (backendPetitions.length > 0) setPetitions(backendPetitions);
      if (backendVotes.length > 0) setVotes(backendVotes);
      if (backendLikedPostIds.length > 0) setLikedPostIds(backendLikedPostIds);
      if (backendProfile) setUser(backendProfile);
    } catch (err) {
      console.warn('[Supabase] Initial sync failed, fallback to local state', err);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  useEffect(() => {
    if (isSupabaseConnected) {
      refreshFromBackend();
    }
  }, [isSupabaseConnected]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Ignore if unavailable
    }
  };

  const updateUser = (updater: Partial<UserProfile>) => {
    const updated = { ...user, ...updater };
    setUser(updated);
    if (isSupabaseConnected) {
      SupabaseService.upsertProfile(updated).catch(console.error);
    }
  };

  const addPost = (newPostData: Omit<HobbyPost, 'id' | 'likes' | 'views' | 'createdAt' | 'comments'>) => {
    const newPost: HobbyPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likes: 0,
      views: 1,
      createdAt: new Date().toISOString().split('T')[0],
      comments: []
    };
    setPosts((prev) => [newPost, ...prev]);
    triggerConfetti();

    if (isSupabaseConnected) {
      SupabaseService.createPost(newPostData).then((created) => {
        if (created) {
          setPosts((prev) => prev.map((p) => (p.id === newPost.id ? created : p)));
        }
      }).catch(console.error);
    }
  };

  const hasLikedPost = (id: string) => likedPostIds.includes(id);

  const toggleLikePost = (id: string) => {
    const alreadyLiked = likedPostIds.includes(id);

    if (alreadyLiked) {
      // Cancel like (1 like limit)
      setLikedPostIds((prev) => prev.filter((item) => item !== id));
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
      );
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost((prev) =>
          prev ? { ...prev, likes: Math.max(0, prev.likes - 1) } : null
        );
      }
    } else {
      // Add like
      setLikedPostIds((prev) => [...prev, id]);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
      );
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
      }
      triggerConfetti();
    }

    if (isSupabaseConnected) {
      SupabaseService.toggleLikePost(id, user.id).then(({ newLikes }) => {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: newLikes } : p)));
      }).catch(console.error);
    }
  };

  const likePost = (id: string) => {
    toggleLikePost(id);
  };

  const addComment = (postId: string, content: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: `${user.gamerTag} (${user.realName})`,
      content: content.trim(),
      timestamp: '방금 전'
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, newComment]
            }
          : null
      );
    }

    if (isSupabaseConnected) {
      SupabaseService.addComment(postId, newComment).catch(console.error);
    }
  };

  const joinQuest = (questId?: string) => {
    const targetId = questId || quests[0]?.id;
    if (!targetId) return;

    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === targetId) {
          if (q.members.includes(user.realName)) return q;
          if (q.currentCount >= q.maxCount) return q;
          return {
            ...q,
            currentCount: q.currentCount + 1,
            members: [...q.members, user.realName]
          };
        }
        return q;
      })
    );

    if (selectedQuest && selectedQuest.id === targetId) {
      setSelectedQuest((prev) => {
        if (!prev) return null;
        if (prev.members.includes(user.realName)) return prev;
        if (prev.currentCount >= prev.maxCount) return prev;
        return {
          ...prev,
          currentCount: prev.currentCount + 1,
          members: [...prev.members, user.realName]
        };
      });
    }

    triggerConfetti();

    if (isSupabaseConnected) {
      SupabaseService.joinQuest(targetId, user.realName).catch(console.error);
    }
  };

  const leaveQuest = (questId?: string) => {
    const targetId = questId || quests[0]?.id;
    if (!targetId) return;

    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === targetId) {
          if (!q.members.includes(user.realName)) return q;
          return {
            ...q,
            currentCount: Math.max(1, q.currentCount - 1),
            members: q.members.filter((m) => m !== user.realName)
          };
        }
        return q;
      })
    );

    if (selectedQuest && selectedQuest.id === targetId) {
      setSelectedQuest((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentCount: Math.max(1, prev.currentCount - 1),
          members: prev.members.filter((m) => m !== user.realName)
        };
      });
    }

    if (isSupabaseConnected) {
      SupabaseService.leaveQuest(targetId, user.realName).catch(console.error);
    }
  };

  const addQuest = (
    newQuestData: Omit<QuestParty, 'id' | 'currentCount' | 'members' | 'status'>
  ) => {
    const newQuest: QuestParty = {
      ...newQuestData,
      id: `quest-${Date.now()}`,
      currentCount: 1,
      members: [user.realName],
      status: 'recruiting'
    };
    setQuests((prev) => [newQuest, ...prev]);
    setSelectedQuest(newQuest);
    triggerConfetti();

    if (isSupabaseConnected) {
      SupabaseService.createQuest(newQuest).catch(console.error);
    }
  };

  const updateQuestForm = (title: string, locationAndTime: string, maxCount: number) => {
    setQuests((prev) => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      const updatedFirst = {
        ...first,
        title,
        locationAndTime,
        maxCount,
        currentCount: Math.min(first.currentCount, maxCount)
      };
      if (isSupabaseConnected) {
        SupabaseService.createQuest(updatedFirst).catch(console.error);
      }
      return [updatedFirst, ...rest];
    });
    triggerConfetti();
  };

  const addPetition = (data: {
    title: string;
    category: string;
    isAnonymous: boolean;
    reason: string;
    expectedOutcome: string;
    notes: string;
    photoUrl?: string;
  }) => {
    const newNumber = `#2026-0${85 + petitions.length}`;
    const newPet: PetitionItem = {
      id: `pet-${Date.now()}`,
      refNumber: newNumber,
      title: data.title,
      category: data.category,
      authorId: data.isAnonymous ? 'student_2026 (익명)' : `${user.gamerTag}`,
      isAnonymous: data.isAnonymous,
      reason: data.reason,
      expectedOutcome: data.expectedOutcome,
      notes: data.notes || '접수 완료',
      photoUrl: data.photoUrl,
      step: 1,
      statusLabel: '접수 완료',
      submittedDate: '방금 전 완료',
      forwardedDate: '담당 부서 배정 대기 중',
      completedDate: '예정일 산정 중',
      adminFeedback: '학생 신문고에 정상 접수되었습니다. 해당 부서 검토 후 영업일 기준 신속히 피드백이 등록됩니다.'
    };

    setPetitions((prev) => [newPet, ...prev]);
    setSelectedPetitionId(newPet.id);
    triggerConfetti();

    if (isSupabaseConnected) {
      SupabaseService.createPetition(newPet).catch(console.error);
    }
  };

  const castVote = (topicId: string, optionId: string): boolean => {
    const target = votes.find((t) => t.id === topicId);
    if (!target) return false;

    // 이미 투표를 완료한 안건인 경우 차단
    if (target.userVotedOptionId) {
      return false;
    }

    setVotes((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;

        const updatedOptions = t.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        }) as [typeof t.options[0], typeof t.options[1]];

        return {
          ...t,
          options: updatedOptions,
          userVotedOptionId: optionId
        };
      })
    );

    triggerConfetti();

    if (isSupabaseConnected) {
      SupabaseService.castVote(topicId, optionId, user.id).then((res) => {
        if (res.updatedVotes) {
          setVotes(res.updatedVotes);
        }
      }).catch(console.error);
    }

    return true;
  };

  const updateVoteTopic = (topicId: string, title: string, opt1Name: string, opt2Name: string) => {
    setVotes((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          title: title.trim() || t.title,
          options: [
            { ...t.options[0], name: opt1Name.trim() || t.options[0].name },
            { ...t.options[1], name: opt2Name.trim() || t.options[1].name }
          ]
        };
      })
    );
    triggerConfetti();

    if (isSupabaseConnected && supabase) {
      (async () => {
        try {
          await supabase.from('votes').update({ title: title.trim() }).eq('id', topicId);
          const target = votes.find((v) => v.id === topicId);
          if (target) {
            await supabase.from('vote_options').update({ label: opt1Name.trim() }).eq('id', target.options[0].id);
            await supabase.from('vote_options').update({ label: opt2Name.trim() }).eq('id', target.options[1].id);
          }
        } catch (err) {
          console.error(err);
        }
      })();
    }
  };

  const createVoteTopic = (title: string, opt1Name: string, opt2Name: string, remainingTime: string = 'D-7 남음') => {
    const newId = `vote-${Date.now()}`;
    const newTopic: VoteTopic = {
      id: newId,
      numberTag: `안건 #${votes.length + 1 < 10 ? '0' : ''}${votes.length + 1}`,
      isHot: false,
      title: title.trim(),
      statusText: '진행중',
      remainingTime: remainingTime || 'D-7 남음',
      options: [
        {
          id: `${newId}-opt-1`,
          name: opt1Name.trim(),
          votes: 0
        },
        {
          id: `${newId}-opt-2`,
          name: opt2Name.trim(),
          votes: 0
        }
      ]
    };
    setVotes((prev) => [newTopic, ...prev]);
    setSelectedVoteId(newId);
    triggerConfetti();

    if (isSupabaseConnected && supabase) {
      (async () => {
        try {
          await supabase.from('votes').insert({
            id: newId,
            title: title.trim(),
            category: '학생회 자치',
            d_day: remainingTime,
            is_hot: false,
            total_votes: 0
          });

          await supabase.from('vote_options').insert([
            { id: `${newId}-opt-1`, vote_id: newId, label: opt1Name.trim(), votes: 0, percent: 50 },
            { id: `${newId}-opt-2`, vote_id: newId, label: opt2Name.trim(), votes: 0, percent: 50 }
          ]);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  };

  const selectedPetition =
    petitions.find((p) => p.id === selectedPetitionId) || petitions[0];

  const selectedVote =
    votes.find((v) => v.id === selectedVoteId) || votes[0];

  return (
    <AppContext.Provider
      value={{
        tab,
        setTab,
        user,
        updateUser,
        isSupabaseConnected,
        isLoadingBackend,
        refreshFromBackend,
        posts,
        selectedCategory,
        setSelectedCategory,
        selectedPost,
        setSelectedPost,
        addPost,
        likedPostIds,
        hasLikedPost,
        toggleLikePost,
        likePost,
        addComment,
        quests,
        quest,
        selectedQuestCategory,
        setSelectedQuestCategory,
        selectedQuest,
        setSelectedQuest,
        joinQuest,
        leaveQuest,
        addQuest,
        updateQuestForm,
        petitions,
        selectedPetition,
        setSelectedPetitionId,
        selectedPetitionCategory,
        setSelectedPetitionCategory,
        addPetition,
        votes,
        selectedVote,
        setSelectedVoteId,
        castVote,
        updateVoteTopic,
        createVoteTopic,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
