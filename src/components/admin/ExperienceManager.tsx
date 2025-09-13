import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type WorkExperience = Database['public']['Tables']['work_experiences']['Row'];
type WorkExperienceInsert = Database['public']['Tables']['work_experiences']['Insert'];
type Education = Database['public']['Tables']['education']['Row'];
type EducationInsert = Database['public']['Tables']['education']['Insert'];

const ExperienceManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [isWorkDialogOpen, setIsWorkDialogOpen] = useState(false);
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkExperience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [workFormData, setWorkFormData] = useState<Partial<WorkExperienceInsert>>({});
  const [educationFormData, setEducationFormData] = useState<Partial<EducationInsert>>({});

  useEffect(() => {
    fetchWorkExperiences();
    fetchEducation();
  }, []);

  const fetchWorkExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('work_experiences')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setWorkExperiences(data || []);
    } catch (error) {
      console.error('Error fetching work experiences:', error);
    }
  };

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setEducation(data || []);
    } catch (error) {
      console.error('Error fetching education:', error);
    }
  };

  const handleSaveWork = async () => {
    if (!user) return;

    // Validate required fields
    if (!workFormData.company || !workFormData.title || !workFormData.start_date) {
      toast({
        title: "Error",
        description: "Company, Title, and Start Date are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSave = {
        ...workFormData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
        company: workFormData.company,
        title: workFormData.title,
        start_date: workFormData.start_date,
      };

      if (editingWork) {
        const { error } = await supabase
          .from('work_experiences')
          .update(dataToSave)
          .eq('id', editingWork.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('work_experiences')
          .insert([dataToSave]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Work experience ${editingWork ? 'updated' : 'created'} successfully`,
      });
      
      setIsWorkDialogOpen(false);
      setEditingWork(null);
      setWorkFormData({});
      fetchWorkExperiences();
    } catch (error) {
      console.error('Error saving work experience:', error);
      toast({
        title: "Error",
        description: "Failed to save work experience",
        variant: "destructive",
      });
    }
  };

  const handleSaveEducation = async () => {
    if (!user) return;

    // Validate required fields
    if (!educationFormData.institution || !educationFormData.degree) {
      toast({
        title: "Error",
        description: "Institution and Degree are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSave = {
        ...educationFormData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
        institution: educationFormData.institution,
        degree: educationFormData.degree,
      };

      if (editingEducation) {
        const { error } = await supabase
          .from('education')
          .update(dataToSave)
          .eq('id', editingEducation.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('education')
          .insert([dataToSave]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Education ${editingEducation ? 'updated' : 'created'} successfully`,
      });
      
      setIsEducationDialogOpen(false);
      setEditingEducation(null);
      setEducationFormData({});
      fetchEducation();
    } catch (error) {
      console.error('Error saving education:', error);
      toast({
        title: "Error",
        description: "Failed to save education",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWork = async (id: string) => {
    try {
      const { error } = await supabase
        .from('work_experiences')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Work experience deleted successfully",
      });
      
      fetchWorkExperiences();
    } catch (error) {
      console.error('Error deleting work experience:', error);
      toast({
        title: "Error",
        description: "Failed to delete work experience",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Education deleted successfully",
      });
      
      fetchEducation();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast({
        title: "Error",
        description: "Failed to delete education",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Experience & Education</h2>
      
      <Tabs defaultValue="work" className="w-full">
        <TabsList>
          <TabsTrigger value="work">Work Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
        
        <TabsContent value="work" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Work Experience</h3>
            <Dialog open={isWorkDialogOpen} onOpenChange={setIsWorkDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingWork(null);
                  setWorkFormData({});
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Work Experience
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingWork ? 'Edit Work Experience' : 'Add New Work Experience'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Company</label>
                      <Input
                        value={workFormData.company || ''}
                        onChange={(e) => setWorkFormData(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={workFormData.title || ''}
                        onChange={(e) => setWorkFormData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={workFormData.location || ''}
                      onChange={(e) => setWorkFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={workFormData.start_date || ''}
                        onChange={(e) => setWorkFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={workFormData.end_date || ''}
                        onChange={(e) => setWorkFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        disabled={workFormData.current}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="current-work"
                      checked={workFormData.current || false}
                      onCheckedChange={(checked) => setWorkFormData(prev => ({ 
                        ...prev, 
                        current: checked as boolean,
                        end_date: checked ? undefined : prev.end_date
                      }))}
                    />
                    <label htmlFor="current-work" className="text-sm font-medium">Current Position</label>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={workFormData.description || ''}
                      onChange={(e) => setWorkFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Display Order</label>
                    <Input
                      type="number"
                      value={workFormData.display_order || 0}
                      onChange={(e) => setWorkFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsWorkDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveWork}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {workExperiences.map((work) => (
              <Card key={work.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div>
                      <div>{work.title} at {work.company}</div>
                      <div className="text-sm text-muted-foreground font-normal">
                        {work.start_date} - {work.current ? 'Present' : work.end_date}
                        {work.location && ` • ${work.location}`}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditingWork(work);
                        setWorkFormData(work);
                        setIsWorkDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteWork(work.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                {work.description && (
                  <CardContent>
                    <p className="text-muted-foreground">{work.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Education</h3>
            <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingEducation(null);
                  setEducationFormData({});
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingEducation ? 'Edit Education' : 'Add New Education'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Institution</label>
                      <Input
                        value={educationFormData.institution || ''}
                        onChange={(e) => setEducationFormData(prev => ({ ...prev, institution: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Degree</label>
                      <Input
                        value={educationFormData.degree || ''}
                        onChange={(e) => setEducationFormData(prev => ({ ...prev, degree: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Field of Study</label>
                    <Input
                      value={educationFormData.field_of_study || ''}
                      onChange={(e) => setEducationFormData(prev => ({ ...prev, field_of_study: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={educationFormData.start_date || ''}
                        onChange={(e) => setEducationFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={educationFormData.end_date || ''}
                        onChange={(e) => setEducationFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        disabled={educationFormData.current}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="current-education"
                      checked={educationFormData.current || false}
                      onCheckedChange={(checked) => setEducationFormData(prev => ({ 
                        ...prev, 
                        current: checked as boolean,
                        end_date: checked ? undefined : prev.end_date
                      }))}
                    />
                    <label htmlFor="current-education" className="text-sm font-medium">Currently Enrolled</label>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Grade</label>
                    <Input
                      value={educationFormData.grade || ''}
                      onChange={(e) => setEducationFormData(prev => ({ ...prev, grade: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={educationFormData.description || ''}
                      onChange={(e) => setEducationFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Display Order</label>
                    <Input
                      type="number"
                      value={educationFormData.display_order || 0}
                      onChange={(e) => setEducationFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEducationDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveEducation}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {education.map((edu) => (
              <Card key={edu.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div>
                      <div>{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</div>
                      <div className="text-sm text-muted-foreground font-normal">
                        {edu.institution}
                      </div>
                      <div className="text-sm text-muted-foreground font-normal">
                        {edu.start_date} - {edu.current ? 'Present' : edu.end_date}
                        {edu.grade && ` • Grade: ${edu.grade}`}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditingEducation(edu);
                        setEducationFormData(edu);
                        setIsEducationDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteEducation(edu.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                {edu.description && (
                  <CardContent>
                    <p className="text-muted-foreground">{edu.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExperienceManager;