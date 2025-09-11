import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type WorkExperience = Database['public']['Tables']['work_experiences']['Row'];
type Education = Database['public']['Tables']['education']['Row'];

const ExperienceSection = () => {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workResponse, educationResponse] = await Promise.all([
          supabase
            .from('work_experiences')
            .select('*')
            .order('start_date', { ascending: false }),
          supabase
            .from('education')
            .select('*')
            .order('start_date', { ascending: false })
        ]);

        if (workResponse.error) throw workResponse.error;
        if (educationResponse.error) throw educationResponse.error;

        setWorkExperiences(workResponse.data || []);
        setEducation(educationResponse.data || []);
      } catch (error) {
        console.error('Error fetching experience data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section id="experience" className="py-16 bg-muted/50">
        <div className="container mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Experience & Education</h2>
          <div className="text-center">Loading experience...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-16 bg-muted/50">
      <div className="container mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Experience & Education</h2>
        
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Work Experience */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Work Experience</h3>
            <div className="space-y-6">
              {workExperiences.map((exp) => (
                <div key={exp.id} className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold">{exp.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-primary font-medium mb-2">{exp.company}</p>
                  {exp.location && (
                    <p className="text-sm text-muted-foreground mb-3">{exp.location}</p>
                  )}
                  {exp.description && (
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Education</h3>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold">{edu.degree}</h4>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(edu.start_date)} - {edu.current ? 'Present' : formatDate(edu.end_date)}
                    </span>
                  </div>
                  <p className="text-primary font-medium mb-2">{edu.institution}</p>
                  {edu.field_of_study && (
                    <p className="text-sm text-muted-foreground mb-2">{edu.field_of_study}</p>
                  )}
                  {edu.grade && (
                    <p className="text-sm text-muted-foreground mb-2">Grade: {edu.grade}</p>
                  )}
                  {edu.description && (
                    <p className="text-sm text-muted-foreground">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;