import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import ProfileSection from "@/components/ProfileSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import CertificatesSection from "@/components/CertificatesSection";
import ReferencesSection from "@/components/ReferencesSection";
import AuthDialog from "@/components/auth/AuthDialog";
import TypingAnimation from "@/components/animations/TypingAnimation";
import FloatingElements from "@/components/animations/FloatingElements";
import ScrollReveal from "@/components/animations/ScrollReveal";
import InteractiveButton from "@/components/animations/InteractiveButton";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
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
    <div className="min-h-screen bg-background relative">
      <FloatingElements />
      <Navigation />
      
      <main className="relative z-10">
        <section id="home" className="container mx-auto grid max-w-5xl gap-8 px-6 py-24 md:grid-cols-2 md:py-32 relative">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-2">
              <TypingAnimation 
                text={displayName} 
                className="text-4xl font-bold tracking-tight md:text-5xl block"
                speed={80}
              />
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
              >
                {displayTitle} • {profile?.location || 'Kigali, Rwanda'}
              </motion.p>
            </div>
            
            <motion.p 
              className="text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.6 }}
            >
              {profile?.bio || 'Building reliable, user-focused software. Explore selected projects, certifications, and professional experience.'}
            </motion.p>
            
            <motion.div 
              className="flex gap-3 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.6 }}
            >
              <InteractiveButton href="#projects" variant="primary">
                View Projects
              </InteractiveButton>
              
              {user ? (
                <div className="flex gap-2 flex-wrap">
                  <InteractiveButton href="/admin" variant="secondary">
                    Manage Portfolio
                  </InteractiveButton>
                  <InteractiveButton onClick={handleSignOut} variant="secondary">
                    Sign Out
                  </InteractiveButton>
                </div>
              ) : (
                <InteractiveButton 
                  onClick={() => setAuthDialogOpen(true)} 
                  variant="secondary"
                >
                  Owner Login
                </InteractiveButton>
              )}
            </motion.div>
          </motion.div>
          
          <ScrollReveal direction="right" delay={0.3}>
            <motion.div 
              className="rounded-lg border bg-card/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="mb-4 text-2xl font-semibold">Portfolio Highlights</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                  <span className="text-sm font-medium">Years Experience</span>
                  <AnimatedCounter end={5} suffix="+" className="text-xl font-bold text-primary" />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/5">
                  <span className="text-sm font-medium">Projects Completed</span>
                  <AnimatedCounter end={25} suffix="+" className="text-xl font-bold text-secondary" />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/5">
                  <span className="text-sm font-medium">Technologies</span>
                  <AnimatedCounter end={15} suffix="+" className="text-xl font-bold text-accent-foreground" />
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <motion.li 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 4, duration: 0.3 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Clean, modern, responsive UI
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 4.2, duration: 0.3 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    Dynamic project showcase
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 4.4, duration: 0.3 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    Professional credentials
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 4.6, duration: 0.3 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Secure content management
                  </motion.li>
                </ul>
              </div>
            </motion.div>
          </ScrollReveal>
        </section>

        <ScrollReveal direction="up" delay={0.1}>
          <ProfileSection />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.2}>
          <SkillsSection />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.1}>
          <ExperienceSection />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.2}>
          <ProjectsSection />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.1}>
          <CertificatesSection />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.2}>
          <ReferencesSection />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={0.1}>
          <ContactSection />
        </ScrollReveal>
      </main>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      <ScrollReveal direction="up">
        <footer className="border-t py-8 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center space-x-6 text-muted-foreground">
                <motion.a 
                  href="#home" 
                  className="hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  Home
                </motion.a>
                <motion.a 
                  href="#about" 
                  className="hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  About
                </motion.a>
                <motion.a 
                  href="#projects" 
                  className="hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  Projects
                </motion.a>
                <motion.a 
                  href="#contact" 
                  className="hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  Contact
                </motion.a>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              <p className="text-muted-foreground">&copy; 2024 Ndegeya Fadhiri. All rights reserved.</p>
            </motion.div>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  );
};

export default Index;