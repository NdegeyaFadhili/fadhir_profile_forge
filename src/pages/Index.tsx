import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import ProfileSection from "@/components/ProfileSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import CertificatesSection from "@/components/CertificatesSection";
import ReferencesSection from "@/components/ReferencesSection";
import AuthDialog from "@/components/auth/AuthDialog";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const Index = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .maybeSingle();
        
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const displayName = profile?.full_name || 'Ihirwe Ndegeya Fadhiri';
  const displayTitle = profile?.title || 'Software Developer';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section id="home" className="container mx-auto grid max-w-5xl gap-8 px-6 py-24 md:grid-cols-2 md:py-32">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{displayName}</h1>
            <p className="text-lg text-muted-foreground">{displayTitle} • {profile?.location || 'Kigali, Rwanda'}</p>
            <p className="text-muted-foreground">
              {profile?.bio || 'Building reliable, user-focused software. Explore selected projects, certifications, and professional experience.'}
            </p>
            <div className="flex gap-3">
              <a 
                href="#projects"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                View Projects
              </a>
              {user ? (
                <div className="flex gap-2">
                  <a 
                    href="/admin"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    Manage Portfolio
                  </a>
                  <button 
                    onClick={handleSignOut}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setAuthDialogOpen(true)}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Owner Login
                </button>
              )}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-semibold">Highlights</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Clean, modern, responsive UI</li>
              <li>Project gallery with GitHub and demo links</li>
              <li>Certificates and professional references</li>
              <li>Secure owner-only editing</li>
            </ul>
          </div>
        </section>

        <ProfileSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <CertificatesSection />
        <ReferencesSection />
        <ContactSection />
      </main>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      <footer className="border-t py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2024 Ndegeya Fadhiri. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;