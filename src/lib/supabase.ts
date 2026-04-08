import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Using local storage as fallback.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export const testSupabaseConnection = async () => {
  try {
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return { connected: false, message: 'Supabase URL is missing or using placeholder. Please set VITE_SUPABASE_URL in Settings.' };
    }
    const { data, error } = await supabase.from('students').select('id').limit(1);
    if (error) {
      if (error.message === 'Failed to fetch') {
        return { connected: false, message: 'Network error: Failed to fetch. This usually means the Supabase URL is incorrect or unreachable.' };
      }
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Connected to Supabase' };
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      return { connected: false, message: 'Network error: Failed to fetch. Please check your VITE_SUPABASE_URL configuration.' };
    }
    return { connected: false, message: error.message || 'Connection failed' };
  }
};
