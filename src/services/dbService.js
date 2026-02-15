import { supabase } from '../lib/supabaseClient';

export const dbService = {
  // --- Projects ---
  
  async createProject(userId, topic) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('projects')
      .insert([{ user_id: userId, topic, status: 'active' }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async getProjects(userId) {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getProjectFull(projectId) {
    if (!supabase) return null;

    // Get project meta
    const { data: project, error: pError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (pError) throw pError;

    // Get all generations
    const { data: generations, error: gError } = await supabase
      .from('generations')
      .select('*')
      .eq('project_id', projectId);

    if (gError) throw gError;

    // Transform generations into key-value map for the context
    const dataMap = {};
    generations.forEach(gen => {
      dataMap[gen.type] = gen.content;
    });

    return { ...project, data: dataMap };
  },

  async deleteProject(projectId) {
    if (!supabase) return;
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) throw error;
  },

  // --- Generations (Upsert) ---

  async saveGeneration(userId, projectId, type, content) {
    if (!supabase) return;

    // Check if exists first to decide update vs insert (or use upsert with conflict key)
    // For simplicity, we'll search by project_id + type
    const { data: existing } = await supabase
      .from('generations')
      .select('id')
      .eq('project_id', projectId)
      .eq('type', type)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('generations')
        .update({ content, updated_at: new Date() })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('generations')
        .insert([{ 
          user_id: userId, 
          project_id: projectId, 
          type, 
          content 
        }]);
      if (error) throw error;
    }
    
    // Also touch the project's updated_at
    await supabase
      .from('projects')
      .update({ updated_at: new Date() })
      .eq('id', projectId);
  },

  // --- Assets ---

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
    return data;
  },

  async deleteAsset(assetId) {
    if (!supabase) return;
    const { error } = await supabase.from('assets').delete().eq('id', assetId);
    if (error) throw error;
  },
};
