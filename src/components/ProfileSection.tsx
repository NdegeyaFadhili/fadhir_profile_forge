import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const ProfileSection = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-16 bg-muted/50">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="text-center">Loading profile...</div>
        </div>
      </section>
    );
  }

  const displayProfile = profile || {
    full_name: 'Ihirwe Ndegeya Fadhiri',
    title: 'Software Developer',
    bio: 'Passionate software developer with expertise in modern web technologies. I focus on creating clean, efficient, and user-friendly applications that solve real-world problems.',
    location: 'Gisozi, Kigali, Rwanda',
    email: 'ihirwe@example.com',
    phone: '+250 XXX XXX XXX',
    linkedin_url: 'linkedin.com/in/ihirwe',
    github_url: 'github.com/ihirwe',
    profile_image_url: null
  };

  return (
    <section id="about" className="py-16 bg-muted/50">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            {displayProfile.profile_image_url ? (
              <img 
                src={displayProfile.profile_image_url} 
                alt={displayProfile.full_name}
                className="mx-auto h-48 w-48 rounded-full object-cover md:mx-0"
              />
            ) : (
              <div className="mx-auto h-48 w-48 rounded-full bg-gradient-to-br from-primary to-secondary md:mx-0"></div>
            )}
          </div>
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">About Me</h2>
              <p className="text-muted-foreground leading-relaxed">
                {displayProfile.bio}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2 text-muted-foreground">
                {displayProfile.location && <p>📍 {displayProfile.location}</p>}
                {displayProfile.email && <p>📧 {displayProfile.email}</p>}
                {displayProfile.phone && <p>📱 {displayProfile.phone}</p>}
                {displayProfile.linkedin_url && (
                  <p>💼 <a href={displayProfile.linkedin_url.startsWith('http') ? displayProfile.linkedin_url : `https://${displayProfile.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{displayProfile.linkedin_url}</a></p>
                )}
                {displayProfile.github_url && (
                  <p>💻 <a href={displayProfile.github_url.startsWith('http') ? displayProfile.github_url : `https://${displayProfile.github_url}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{displayProfile.github_url}</a></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;