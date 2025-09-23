import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileManager from "@/components/admin/ProfileManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import SkillsManager from "@/components/admin/SkillsManager";
import ExperienceManager from "@/components/admin/ExperienceManager";
import CertificatesManager from "@/components/admin/CertificatesManager";
import ReferencesManager from "@/components/admin/ReferencesManager";
import ContactMessagesManager from "@/components/admin/ContactMessagesManager";

const Admin = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Portfolio Management</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileManager />
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>
          
          <TabsContent value="skills">
            <SkillsManager />
          </TabsContent>
          
          <TabsContent value="experience">
            <ExperienceManager />
          </TabsContent>
          
          <TabsContent value="certificates">
            <CertificatesManager />
          </TabsContent>
          
          <TabsContent value="references">
            <ReferencesManager />
          </TabsContent>
          
          <TabsContent value="messages">
            <ContactMessagesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;