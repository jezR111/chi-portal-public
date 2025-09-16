// /features/yin/components/apps/community/hooks/useCommunityProfile.ts
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function useCommunityProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('community_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    setProfile(data);
    setLoading(false);
  };

  const updateProfile = async (updates: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('community_profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (data) {
      setProfile(data);
    }

    return { data, error };
  };

  return { profile, loading, updateProfile, refetch: loadProfile };
}