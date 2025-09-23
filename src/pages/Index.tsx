import React, { useState, useCallback, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import AuthDialog from "@/components/auth/AuthDialog";
import TypingAnimation from "@/components/animations/TypingAnimation";
import FloatingElements from "@/components/animations/FloatingElements";
import ScrollReveal from "@/components/animations/ScrollReveal";
import InteractiveButton from "@/components/animations/InteractiveButton";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import LoadingSpinner from "@/components/optimized/LoadingSpinner";
import { useAuth } from "@/contexts/AuthProvider";
import { useOptimizedData } from "@/hooks/useOptimizedData";
import { supabase } from "@/integrations/supabase/client";

// Lazy load sections for better performance
const ProfileSection = React.lazy(() => import("@/components/ProfileSection"));
const ProjectsSection = React.lazy(() => import("@/components/ProjectsSection"));
const ContactSection = React.lazy(() => import("@/components/ContactSection"));
const SkillsSection = React.lazy(() => import("@/components/SkillsSection"));
const ExperienceSection = React.lazy(() => import("@/components/ExperienceSection"));
const CertificatesSection = React.lazy(() => import("@/components/CertificatesSection"));
const ReferencesSection = React.lazy(() => import("@/components/ReferencesSection"));

const Index = React.memo(() => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user } = useAuth();
  
  // Use optimized data hook with caching and real-time updates
  const { 
    profile, 
    stats, 
    loading, 
    error 
  } = useOptimizedData();

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const displayName = useMemo(() => 
    profile?.full_name || 'Ihirwe Ndegeya Fadhiri', [profile?.full_name]
  );
  
  const displayTitle = useMemo(() => 
    profile?.title || 'Software Developer', [profile?.title]
  );

  const displayBio = useMemo(() => 
    profile?.bio || 'Building reliable, user-focused software. Explore selected projects, certifications, and professional experience.',
    [profile?.bio]
  );

  const displayLocation = useMemo(() => 
    profile?.location || 'Kigali, Rwanda', [profile?.location]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Portfolio..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-destructive">Failed to Load Portfolio</h1>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background relative">
      <FloatingElements />
      
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
                {displayTitle} • {displayLocation}
              </motion.p>
            </div>
            
            <motion.p 
              className="text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.6 }}
            >
              {displayBio}
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
                  <AnimatedCounter end={stats.yearsExperience} suffix="+" className="text-xl font-bold text-primary" />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/5">
                  <span className="text-sm font-medium">Projects Completed</span>
                  <AnimatedCounter end={stats.projectsCount} suffix={stats.projectsCount > 0 ? "+" : ""} className="text-xl font-bold text-secondary" />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/5">
                  <span className="text-sm font-medium">Technologies</span>
                  <AnimatedCounter end={stats.technologiesCount} suffix="+" className="text-xl font-bold text-accent-foreground" />
                </div>
                {stats.certificatesCount > 0 && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                    <span className="text-sm font-medium">Certifications</span>
                    <AnimatedCounter end={stats.certificatesCount} suffix="" className="text-xl font-bold text-primary" />
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Portfolio Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <motion.li 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 4, duration: 0.3 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {stats.skillsCount > 0 ? `${stats.skillsCount} Technical Skills` : 'Technical Skills Showcase'}
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 4.2, duration: 0.3 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    {stats.projectsCount > 0 ? `${stats.projectsCount} Featured Projects` : 'Project Portfolio'}
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 4.4, duration: 0.3 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    Professional Experience
                  </motion.li>
                  {stats.certificatesCount > 0 && (
                    <motion.li 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 4.6, duration: 0.3 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      Professional Certifications
                    </motion.li>
                  )}
                </ul>
              </div>
            </motion.div>
          </ScrollReveal>
        </section>

        <Suspense fallback={<LoadingSpinner />}>
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
        </Suspense>
      </main>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

    </div>
  );
});

Index.displayName = 'Index';

export default Index;