/**
 * Creator Intelligence OS — Database Service
 * All Supabase CRUD operations. Null-safe (returns gracefully when supabase is not initialized).
 */
import { supabase } from '../lib/supabaseClient';

export const dbService = {

  // ─────────────────────────────────────────
  // Projects
  // ─────────────────────────────────────────

  async createProject(userId, topic, teamId = null) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('projects')
      .insert([{ user_id: userId, team_id: teamId, topic, status: 'active' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProjects(userId, teamId = null) {
    if (!supabase) return [];
    let query = supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (teamId) {
      query = query.eq('team_id', teamId);
    } else {
      query = query.eq('user_id', userId).is('team_id', null);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async getProjectFull(projectId) {
    if (!supabase) return null;
    const { data: project, error: pError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    if (pError) throw pError;

    const { data: generations, error: gError } = await supabase
      .from('generations')
      .select('*')
      .eq('project_id', projectId);
    if (gError) throw gError;

    const dataMap = {};
    generations.forEach(gen => { dataMap[gen.type] = gen.content; });
    return { ...project, data: dataMap };
  },

  async deleteProject(projectId) {
    if (!supabase) return;
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) throw error;
  },

  // ─────────────────────────────────────────
  // Generations — uses proper UPSERT now
  // ─────────────────────────────────────────

  async saveGeneration(userId, projectId, type, content) {
    if (!supabase) return;
    const { error } = await supabase
      .from('generations')
      .upsert(
        [{ user_id: userId, project_id: projectId, type, content, updated_at: new Date() }],
        { onConflict: 'project_id,type' }
      );
    if (error) throw error;

    // Touch project's updated_at
    await supabase.from('projects').update({ updated_at: new Date() }).eq('id', projectId);
  },

  // ─────────────────────────────────────────
  // Assets
  // ─────────────────────────────────────────

  async saveAsset(userId, projectId, type, url, prompt = '') {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('assets')
      .insert([{ user_id: userId, project_id: projectId, type, url, prompt }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAssets(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('assets')
      .select('*, projects(topic)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getAssetsByProject(userId, projectId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async deleteAsset(assetId) {
    if (!supabase) return;
    const { error } = await supabase.from('assets').delete().eq('id', assetId);
    if (error) throw error;
  },

  // ─────────────────────────────────────────
  // Teams
  // ─────────────────────────────────────────

  async createTeam(userId, name) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('teams')
      .insert([{ owner_id: userId, name }])
      .select()
      .single();
    if (error) throw error;

    // Add owner as first member
    await supabase.from('team_members').insert([{
      team_id: data.id,
      user_id: userId,
      email: '',
      role: 'owner',
      status: 'active'
    }]);
    return data;
  },

  async getUserTeams(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('teams')
      .select('*, team_members(*)')
      .or(`owner_id.eq.${userId},team_members.user_id.eq.${userId}`);
    if (error) throw error;
    return data ?? [];
  },

  async inviteMember(teamId, email, role = 'editor') {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('team_members')
      .upsert([{ team_id: teamId, email, role, status: 'pending' }], { onConflict: 'team_id,email' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateMemberRole(memberId, role) {
    if (!supabase) return;
    const { error } = await supabase.from('team_members').update({ role }).eq('id', memberId);
    if (error) throw error;
  },

  async removeMember(memberId) {
    if (!supabase) return;
    const { error } = await supabase.from('team_members').delete().eq('id', memberId);
    if (error) throw error;
  },

  // ─────────────────────────────────────────
  // Comments
  // ─────────────────────────────────────────

  async getComments(contextId, teamId = null) {
    if (!supabase) return [];
    let query = supabase
      .from('comments')
      .select('*')
      .eq('context_id', contextId)
      .order('created_at', { ascending: true });
    if (teamId) {
      query = query.eq('team_id', teamId);
    } else {
      query = query.is('team_id', null);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async addComment(userId, contextId, text, teamId = null) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('comments')
      .insert([{ user_id: userId, context_id: contextId, text, team_id: teamId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteComment(commentId) {
    if (!supabase) return;
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) throw error;
  },

  // ─────────────────────────────────────────
  // Revenue (stored as 'revenue_record' generations)
  // ─────────────────────────────────────────

  async getRevenue(userId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('generations')
      .select('content')
      .eq('user_id', userId)
      .eq('type', 'revenue_record');
    if (error) throw error;
    return (data ?? []).map(d => d.content);
  },

  async saveRevenue(userId, projectId, record) {
    if (!supabase) return;
    const { error } = await supabase
      .from('generations')
      .insert([{ user_id: userId, project_id: projectId, type: 'revenue_record', content: record }]);
    if (error) throw error;
  },

  // ─────────────────────────────────────────
  // Activity Log
  // ─────────────────────────────────────────

  async logActivity(userId, type, description, teamId = null, projectId = null, metadata = {}) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('activity_log')
      .insert([{ user_id: userId, team_id: teamId, project_id: projectId, type, description, metadata }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getActivityLog(userId, teamId = null, limit = 50) {
    if (!supabase) return [];
    let query = supabase
      .from('activity_log')
      .select('*, projects(topic)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (teamId) {
      query = query.eq('team_id', teamId);
    } else {
      query = query.eq('user_id', userId).is('team_id', null);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  // ─────────────────────────────────────────
  // Tasks
  // ─────────────────────────────────────────

  async createTask(userId, projectId, taskData, teamId = null) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: userId,
        project_id: projectId,
        team_id: teamId,
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        due_date: taskData.dueDate || null,
        assigned_to: taskData.assignedTo || null
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getTasks(projectId) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async updateTask(taskId, updates) {
    if (!supabase) return;
    const { error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', taskId);
    if (error) throw error;
  },

  async deleteTask(taskId) {
    if (!supabase) return;
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) throw error;
  },

  async bulkAddTasks(userId, projectId, tasksList, teamId = null) {
    if (!supabase) return [];
    const rows = tasksList.map(t => ({
      user_id: userId, project_id: projectId, team_id: teamId,
      title: t.title, description: t.description || '',
      priority: t.priority || 'medium', status: 'todo'
    }));
    const { data, error } = await supabase.from('tasks').insert(rows).select();
    if (error) throw error;
    return data;
  },

  // ─────────────────────────────────────────
  // Real-Time Subscriptions
  // ─────────────────────────────────────────

  /**
   * Subscribe to a project's data changes in real-time.
   * Fires `onProjectChange` whenever projects, generations, assets, tasks, or comments update.
   * Returns a cleanup function — call it to unsubscribe.
   *
   * @param {string} projectId
   * @param {object} callbacks
   * @param {(payload: object) => void} callbacks.onProjectChange
   * @param {(payload: object) => void} [callbacks.onGenerationChange]
   * @param {(payload: object) => void} [callbacks.onTaskChange]
   * @param {(payload: object) => void} [callbacks.onCommentChange]
   * @param {(payload: object) => void} [callbacks.onAssetChange]
   * @returns {() => void} unsubscribe function
   */
  subscribeToProject(projectId, callbacks = {}) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel(`project:${projectId}`)

      // Generations
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'generations',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        callbacks.onGenerationChange?.(payload);
        callbacks.onProjectChange?.(payload);
      })

      // Tasks
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'tasks',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        callbacks.onTaskChange?.(payload);
        callbacks.onProjectChange?.(payload);
      })

      // Comments
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'comments',
        filter: `context_id=eq.${projectId}`
      }, (payload) => {
        callbacks.onCommentChange?.(payload);
        callbacks.onProjectChange?.(payload);
      })

      // Assets
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'assets',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        callbacks.onAssetChange?.(payload);
        callbacks.onProjectChange?.(payload);
      })

      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  /**
   * Subscribe to all projects list changes for a user.
   * Useful for the project dashboard to auto-refresh.
   * @param {string} userId
   * @param {(payload: object) => void} onChange
   * @returns {() => void} unsubscribe function
   */
  subscribeToUserProjects(userId, onChange) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel(`user-projects:${userId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'projects',
        filter: `user_id=eq.${userId}`
      }, onChange)
      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  /**
   * Subscribe to team activity for a team workspace.
   * @param {string} teamId
   * @param {(payload: object) => void} onChange
   * @returns {() => void} unsubscribe function
   */
  subscribeToTeam(teamId, onChange) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel(`team:${teamId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'activity_log',
        filter: `team_id=eq.${teamId}`
      }, onChange)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'team_members',
        filter: `team_id=eq.${teamId}`
      }, onChange)
      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  /**
   * Subscribe to comments for a specific context (section, tab, or project id).
   * @param {string} contextId
   * @param {(payload: object) => void} onChange
   * @returns {() => void} unsubscribe function
   */
  subscribeToComments(contextId, onChange) {
    if (!supabase) return () => {};

    const channel = supabase
      .channel(`comments:${contextId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'comments',
        filter: `context_id=eq.${contextId}`
      }, onChange)
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
};
