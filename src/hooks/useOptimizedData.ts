import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];
type WorkExperience = Database['public']['Tables']['work_experiences']['Row'];
type Certificate = Database['public']['Tables']['certificates']['Row'];

interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  workExperiences: WorkExperience[];
  certificates: Certificate[];
}

interface PortfolioStats {
  yearsExperience: number;
  projectsCount: number;
  skillsCount: number;
  certificatesCount: number;
  technologiesCount: number;
}

export const useOptimizedData = () => {
  const [data, setData] = useState<PortfolioData>({
    profile: null,
    projects: [],
    skills: [],
    workExperiences: [],
    certificates: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, projectsRes, skillsRes, workExpRes, certificatesRes] = await Promise.all([
        supabase.from('profiles').select('*').limit(1).maybeSingle(),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('name'),
        supabase.from('work_experiences').select('*').order('start_date', { ascending: false }),
        supabase.from('certificates').select('*').order('issue_date', { ascending: false })
      ]);

      // Check for errors
      if (profileRes.error) throw profileRes.error;
      if (projectsRes.error) throw projectsRes.error;
      if (skillsRes.error) throw skillsRes.error;
      if (workExpRes.error) throw workExpRes.error;
      if (certificatesRes.error) throw certificatesRes.error;

      setData({
        profile: profileRes.data,
        projects: projectsRes.data || [],
        skills: skillsRes.data || [],
        workExperiences: workExpRes.data || [],
        certificates: certificatesRes.data || [],
      });
    } catch (err) {
      // Log the full error for debugging
      console.error('Error fetching portfolio data:', err);

      // Build a helpful message. In dev, include full error properties for easier debugging.
      let message = 'Failed to fetch data';
      if (err instanceof Error) {
        message = err.message;
      } else if (err && typeof err === 'object') {
        try {
          // Include non-enumerable properties too
          message = JSON.stringify(err, Object.getOwnPropertyNames(err));
        } catch (_) {
          message = String(err);
        }
      } else if (typeof err === 'string') {
        message = err;
      }

      // If running in development, append the full JSON blob so you can inspect status/details
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        try {
          message += `\n\n[debug] ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`;
        } catch (_) {
          // ignore stringify errors
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized calculations for better performance
  const stats = useMemo<PortfolioStats>(() => {
    const calculateYearsExperience = () => {
      if (data.workExperiences.length === 0) return 2;
      
      const now = new Date();
      let totalMonths = 0;
      
      data.workExperiences.forEach(exp => {
        const startDate = new Date(exp.start_date);
        const endDate = exp.current ? now : new Date(exp.end_date || now);
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (endDate.getMonth() - startDate.getMonth());
        totalMonths += Math.max(months, 0);
      });
      
      return Math.max(Math.floor(totalMonths / 12), 1);
    };

    const uniqueCategories = [...new Set(data.skills.map(skill => skill.category))];

    return {
      yearsExperience: calculateYearsExperience(),
      projectsCount: data.projects.length || 8,
      skillsCount: data.skills.length || 12,
      certificatesCount: data.certificates.length || 3,
      technologiesCount: uniqueCategories.length || 6,
    };
  }, [data]);

  // Real-time updates subscription
  useEffect(() => {
    const channel = supabase
      .channel('portfolio-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, () => fetchData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects'
      }, () => fetchData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'skills'
      }, () => fetchData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'work_experiences'
      }, () => fetchData())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'certificates'
      }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return {
    ...data,
    stats,
    loading,
    error,
    refetch: fetchData
  };
};