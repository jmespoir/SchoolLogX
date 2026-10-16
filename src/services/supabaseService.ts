import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  UserProfile,
  HobbyPost,
  CommentItem,
  QuestParty,
  PetitionItem,
  VoteTopic,
  VoteCandidate
} from '../types';

export const SupabaseService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  // ==========================================
  // 1. PROFILES
  // ==========================================
  async fetchProfile(userId: string): Promise<UserProfile | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      gamerTag: data.gamer_tag,
      realName: data.real_name,
      bio: data.bio || '',
      avatarIcon: data.avatar_icon || '👾',
      githubUrl: data.github_url || '',
      blogUrl: data.blog_url || '',
      groups: data.groups || []
    };
  },

  async upsertProfile(profile: UserProfile): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('profiles').upsert({
      id: profile.id,
      gamer_tag: profile.gamerTag,
      real_name: profile.realName,
      bio: profile.bio,
      avatar_icon: profile.avatarIcon,
      github_url: profile.githubUrl,
      blog_url: profile.blogUrl,
      groups: profile.groups,
      updated_at: new Date().toISOString()
    });

    return !error;
  },

  // ==========================================
  // 2. HOBBY POSTS & COMMENTS
  // ==========================================
  async fetchPosts(): Promise<HobbyPost[]> {
    if (!supabase) return [];

    const { data: postsData, error: postsError } = await supabase
      .from('hobby_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError || !postsData) return [];

    const { data: commentsData } = await supabase
      .from('post_comments')
      .select('*')
      .order('created_at', { ascending: true });

    const commentsByPost: Record<string, CommentItem[]> = {};
    if (commentsData) {
      commentsData.forEach((c) => {
        if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
        commentsByPost[c.post_id].push({
          id: c.id,
          author: c.author,
          content: c.content,
          timestamp: c.timestamp,
          isHost: c.is_host
        });
      });
    }

    return postsData.map((p) => ({
      id: p.id,
      no: p.no || 'NO.01',
      title: p.title,
      subtitle: p.subtitle || '',
      category: p.category,
      author: p.author,
      authorTag: p.author_tag || 'dev',
      authorGamerTag: p.author_gamer_tag || p.author,
      currentMembers: p.current_members,
      maxMembers: p.max_members,
      likes: p.likes || 0,
      views: p.views || 0,
      createdAt: p.created_at ? p.created_at.split('T')[0] : '2026-10-06',
      description: p.description || '',
      interactiveDemoType: p.interactive_demo_type as HobbyPost['interactiveDemoType'],
      tags: p.tags || [],
      comments: commentsByPost[p.id] || []
    }));
  },

  async fetchLikedPostIds(userId: string): Promise<string[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);

    if (error || !data) return [];
    return data.map((item) => item.post_id);
  },

  async toggleLikePost(postId: string, userId: string): Promise<{ liked: boolean; newLikes: number }> {
    if (!supabase) return { liked: false, newLikes: 0 };

    // Check if already liked
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      // Unlike
      await supabase.from('post_likes').delete().eq('id', existing.id);
      const { data: post } = await supabase.from('hobby_posts').select('likes').eq('id', postId).single();
      const newLikes = Math.max(0, (post?.likes || 1) - 1);
      await supabase.from('hobby_posts').update({ likes: newLikes }).eq('id', postId);
      return { liked: false, newLikes };
    } else {
      // Like
      await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
      const { data: post } = await supabase.from('hobby_posts').select('likes').eq('id', postId).single();
      const newLikes = (post?.likes || 0) + 1;
      await supabase.from('hobby_posts').update({ likes: newLikes }).eq('id', postId);
      return { liked: true, newLikes };
    }
  },

  async createPost(post: Omit<HobbyPost, 'id' | 'likes' | 'views' | 'createdAt' | 'comments'>): Promise<HobbyPost | null> {
    if (!supabase) return null;

    const newId = `post-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('hobby_posts').insert({
      id: newId,
      no: `NO.${Math.floor(Math.random() * 90 + 10)}`,
      title: post.title,
      subtitle: post.subtitle,
      category: post.category,
      author: post.author,
      author_tag: post.authorTag,
      author_gamer_tag: post.authorGamerTag,
      current_members: post.currentMembers || 1,
      max_members: post.maxMembers || 5,
      likes: 0,
      views: 1,
      description: post.description,
      interactive_demo_type: post.interactiveDemoType || 'canvas-art',
      tags: post.tags,
      created_at: new Date().toISOString()
    });

    if (error) return null;

    return {
      ...post,
      id: newId,
      no: 'NO.NEW',
      likes: 0,
      views: 1,
      createdAt: today,
      comments: []
    };
  },

  async addComment(postId: string, comment: CommentItem): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase.from('post_comments').insert({
      id: comment.id,
      post_id: postId,
      author: comment.author,
      content: comment.content,
      timestamp: comment.timestamp,
      is_host: comment.isHost || false,
      created_at: new Date().toISOString()
    });

    return !error;
  },

  // ==========================================
  // 3. QUESTS (소모임 파티)
  // ==========================================
  async fetchQuests(): Promise<QuestParty[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((q) => ({
      id: q.id,
      category: q.category,
      title: q.title,
      description: q.description,
      locationAndTime: q.location_and_time,
      currentCount: q.current_count,
      maxCount: q.max_count,
      status: q.status as QuestParty['status'],
      dDay: q.d_day || 'D-3',
      leader: q.leader,
      members: q.members || [],
      tags: q.tags || [],
      requirements: q.requirements || undefined,
      activityPlan: q.activity_plan || undefined,
      icon: q.icon || undefined
    }));
  },

  async createQuest(quest: QuestParty): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase.from('quests').insert({
      id: quest.id,
      category: quest.category,
      title: quest.title,
      description: quest.description,
      location_and_time: quest.locationAndTime,
      current_count: quest.currentCount,
      max_count: quest.maxCount,
      status: quest.status,
      d_day: quest.dDay,
      leader: quest.leader,
      members: quest.members,
      tags: quest.tags,
      requirements: quest.requirements,
      activity_plan: quest.activityPlan,
      icon: quest.icon,
      created_at: new Date().toISOString()
    });

    return !error;
  },

  async joinQuest(questId: string, memberName: string): Promise<{ success: boolean; quest?: QuestParty }> {
    if (!supabase) return { success: false };

    const { data: questData, error: fetchErr } = await supabase
      .from('quests')
      .select('*')
      .eq('id', questId)
      .single();

    if (fetchErr || !questData) return { success: false };

    const members: string[] = questData.members || [];
    if (members.includes(memberName)) return { success: false };
    if (questData.current_count >= questData.max_count) return { success: false };

    const newMembers = [...members, memberName];
    const newCount = questData.current_count + 1;

    const { error: updateErr } = await supabase
      .from('quests')
      .update({
        members: newMembers,
        current_count: newCount
      })
      .eq('id', questId);

    if (updateErr) return { success: false };

    return {
      success: true,
      quest: {
        id: questData.id,
        category: questData.category,
        title: questData.title,
        description: questData.description,
        locationAndTime: questData.location_and_time,
        currentCount: newCount,
        maxCount: questData.max_count,
        status: questData.status,
        dDay: questData.d_day,
        leader: questData.leader,
        members: newMembers,
        tags: questData.tags,
        requirements: questData.requirements,
        activityPlan: questData.activity_plan,
        icon: questData.icon
      }
    };
  },

  async leaveQuest(questId: string, memberName: string): Promise<{ success: boolean; quest?: QuestParty }> {
    if (!supabase) return { success: false };

    const { data: questData, error: fetchErr } = await supabase
      .from('quests')
      .select('*')
      .eq('id', questId)
      .single();

    if (fetchErr || !questData) return { success: false };

    const members: string[] = questData.members || [];
    if (!members.includes(memberName)) return { success: false };

    const newMembers = members.filter((m) => m !== memberName);
    const newCount = Math.max(1, questData.current_count - 1);

    const { error: updateErr } = await supabase
      .from('quests')
      .update({
        members: newMembers,
        current_count: newCount
      })
      .eq('id', questId);

    if (updateErr) return { success: false };

    return {
      success: true,
      quest: {
        id: questData.id,
        category: questData.category,
        title: questData.title,
        description: questData.description,
        locationAndTime: questData.location_and_time,
        currentCount: newCount,
        maxCount: questData.max_count,
        status: questData.status,
        dDay: questData.d_day,
        leader: questData.leader,
        members: newMembers,
        tags: questData.tags,
        requirements: questData.requirements,
        activityPlan: questData.activity_plan,
        icon: questData.icon
      }
    };
  },

  // ==========================================
  // 4. PETITIONS (학생 신문고)
  // ==========================================
  async fetchPetitions(): Promise<PetitionItem[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('petitions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((p) => ({
      id: p.id,
      refNumber: p.ref_number,
      title: p.title,
      category: p.category,
      authorId: p.author_id,
      isAnonymous: p.is_anonymous,
      reason: p.reason,
      expectedOutcome: p.expected_outcome,
      notes: p.notes,
      photoUrl: p.photo_url || undefined,
      step: p.step as 1 | 2 | 3,
      statusLabel: p.status_label,
      submittedDate: p.submitted_date,
      forwardedDate: p.forwarded_date,
      completedDate: p.completed_date,
      adminFeedback: p.admin_feedback
    }));
  },

  async uploadPetitionPhoto(fileBase64: string, fileName: string): Promise<string | null> {
    if (!supabase) return null;

    try {
      // Decode base64 into a Blob
      const parts = fileBase64.split(';base64,');
      const contentType = parts[0].split(':')[1] || 'image/jpeg';
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], { type: contentType });

      const filePath = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadErr } = await supabase.storage
        .from('petition-photos')
        .upload(filePath, blob, { contentType, upsert: true });

      if (uploadErr) {
        // Fallback: return base64 if storage bucket not yet created
        return fileBase64;
      }

      const { data: publicData } = supabase.storage
        .from('petition-photos')
        .getPublicUrl(filePath);

      return publicData.publicUrl || fileBase64;
    } catch {
      return fileBase64;
    }
  },

  async createPetition(petition: PetitionItem): Promise<boolean> {
    if (!supabase) return false;

    let finalPhotoUrl = petition.photoUrl;
    if (petition.photoUrl && petition.photoUrl.startsWith('data:')) {
      const uploadedUrl = await this.uploadPetitionPhoto(
        petition.photoUrl,
        `photo-${petition.id}.jpg`
      );
      if (uploadedUrl) finalPhotoUrl = uploadedUrl;
    }

    const { error } = await supabase.from('petitions').insert({
      id: petition.id,
      ref_number: petition.refNumber,
      title: petition.title,
      category: petition.category,
      author_id: petition.authorId,
      is_anonymous: petition.isAnonymous,
      reason: petition.reason,
      expected_outcome: petition.expectedOutcome,
      notes: petition.notes,
      photo_url: finalPhotoUrl,
      step: petition.step,
      status_label: petition.statusLabel,
      submitted_date: petition.submittedDate,
      forwarded_date: petition.forwardedDate,
      completed_date: petition.completedDate,
      admin_feedback: petition.adminFeedback,
      created_at: new Date().toISOString()
    });

    return !error;
  },

  // ==========================================
  // 5. VOTES (투표 아레나)
  // ==========================================
  async fetchVotes(userId: string): Promise<VoteTopic[]> {
    if (!supabase) return [];

    const { data: votesData, error: votesError } = await supabase
      .from('votes')
      .select('*')
      .order('created_at', { ascending: false });

    if (votesError || !votesData) return [];

    const { data: optionsData } = await supabase.from('vote_options').select('*');
    const { data: userVotesData } = await supabase
      .from('user_votes')
      .select('vote_id, option_id')
      .eq('user_id', userId);

    const userVotesMap: Record<string, string> = {};
    if (userVotesData) {
      userVotesData.forEach((uv) => {
        userVotesMap[uv.vote_id] = uv.option_id;
      });
    }

    const optionsByVote: Record<string, VoteCandidate[]> = {};
    if (optionsData) {
      optionsData.forEach((opt) => {
        if (!optionsByVote[opt.vote_id]) optionsByVote[opt.vote_id] = [];
        optionsByVote[opt.vote_id].push({
          id: opt.id,
          name: opt.label || opt.name || '선지',
          subtitle: opt.subtitle || undefined,
          votes: opt.votes || 0
        });
      });
    }

    return votesData.map((v, idx) => {
      const opts = optionsByVote[v.id] || [];
      const option1: VoteCandidate = opts[0] || {
        id: `${v.id}-opt-1`,
        name: '선지 1: 찬성',
        votes: 0
      };
      const option2: VoteCandidate = opts[1] || {
        id: `${v.id}-opt-2`,
        name: '선지 2: 반대',
        votes: 0
      };

      return {
        id: v.id,
        numberTag: v.number_tag || `안건 #0${idx + 1}`,
        title: v.title,
        statusText: v.status_text || '진행중',
        remainingTime: v.remaining_time || `${v.d_day || 'D-3'} 남음`,
        isHot: v.is_hot || false,
        options: [option1, option2],
        userVotedOptionId: userVotesMap[v.id]
      };
    });
  },

  async castVote(
    voteId: string,
    optionId: string,
    userId: string
  ): Promise<{ success: boolean; alreadyVoted?: boolean; updatedVotes?: VoteTopic[] }> {
    if (!supabase) return { success: false };

    // 1. Check if user already voted
    const { data: existingVote } = await supabase
      .from('user_votes')
      .select('id')
      .eq('vote_id', voteId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingVote) {
      return { success: false, alreadyVoted: true };
    }

    // 2. Insert user vote
    const { error: insertErr } = await supabase.from('user_votes').insert({
      vote_id: voteId,
      user_id: userId,
      option_id: optionId,
      created_at: new Date().toISOString()
    });

    if (insertErr) return { success: false };

    // 3. Increment option count
    const { data: opt } = await supabase.from('vote_options').select('votes').eq('id', optionId).single();
    const newOptionVotes = (opt?.votes || 0) + 1;
    await supabase.from('vote_options').update({ votes: newOptionVotes }).eq('id', optionId);

    // 4. Update vote total_votes and recalculate percents
    const { data: allOpts } = await supabase.from('vote_options').select('*').eq('vote_id', voteId);
    if (allOpts) {
      const total = allOpts.reduce((sum, item) => sum + (item.id === optionId ? newOptionVotes : item.votes || 0), 0);
      await supabase.from('votes').update({ total_votes: total }).eq('id', voteId);

      for (const item of allOpts) {
        const votesCount = item.id === optionId ? newOptionVotes : item.votes || 0;
        const percent = total > 0 ? Math.round((votesCount / total) * 100) : 0;
        await supabase.from('vote_options').update({ percent }).eq('id', item.id);
      }
    }

    const updatedVotes = await this.fetchVotes(userId);
    return { success: true, updatedVotes };
  }
};
