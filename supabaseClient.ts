import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const updateBeat = async (id: string, updates: any) => {
    const { data, error } = await supabase
        .from('beats')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const deleteBeat = async (id: string) => {
    const { error } = await supabase
        .from('beats')
        .delete()
        .eq('id', id);
    if (error) throw error;
};
