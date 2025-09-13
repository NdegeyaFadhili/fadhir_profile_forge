import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Reference = Database['public']['Tables']['references']['Row'];
type ReferenceInsert = Database['public']['Tables']['references']['Insert'];

const ReferencesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [references, setReferences] = useState<Reference[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<Reference | null>(null);
  const [formData, setFormData] = useState<Partial<ReferenceInsert>>({});

  useEffect(() => {
    fetchReferences();
  }, []);

  const fetchReferences = async () => {
    try {
      const { data, error } = await supabase
        .from('references')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setReferences(data || []);
    } catch (error) {
      console.error('Error fetching references:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate required fields
    if (!formData.name || !formData.title || !formData.company) {
      toast({
        title: "Error",
        description: "Name, Title, and Company are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        user_id: user.id,
        name: formData.name,
        title: formData.title,
        company: formData.company,
        updated_at: new Date().toISOString(),
      };

      if (editingReference) {
        const { error } = await supabase
          .from('references')
          .update(dataToSave)
          .eq('id', editingReference.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('references')
          .insert([dataToSave]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Reference ${editingReference ? 'updated' : 'created'} successfully`,
      });
      
      setIsDialogOpen(false);
      setEditingReference(null);
      setFormData({});
      fetchReferences();
    } catch (error) {
      console.error('Error saving reference:', error);
      toast({
        title: "Error",
        description: "Failed to save reference",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (reference: Reference) => {
    setEditingReference(reference);
    setFormData(reference);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('references')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Reference deleted successfully",
      });
      
      fetchReferences();
    } catch (error) {
      console.error('Error deleting reference:', error);
      toast({
        title: "Error",
        description: "Failed to delete reference",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof ReferenceInsert, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">References</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingReference(null);
              setFormData({});
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Reference
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingReference ? 'Edit Reference' : 'Add New Reference'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Company</label>
                <Input
                  value={formData.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Relationship</label>
                <Input
                  value={formData.relationship || ''}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  placeholder="e.g., Former Manager, Colleague, Client"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Recommendation</label>
                <Textarea
                  value={formData.recommendation || ''}
                  onChange={(e) => handleInputChange('recommendation', e.target.value)}
                  rows={4}
                  placeholder="Reference testimonial or recommendation..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Display Order</label>
                <Input
                  type="number"
                  value={formData.display_order || 0}
                  onChange={(e) => handleInputChange('display_order', parseInt(e.target.value))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {references.map((reference) => (
          <Card key={reference.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <div>{reference.name}</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {reference.title} at {reference.company}
                  </div>
                  {reference.relationship && (
                    <div className="text-sm text-muted-foreground font-normal">
                      {reference.relationship}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {reference.email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${reference.email}`}>
                        <Mail className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {reference.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${reference.phone}`}>
                        <Phone className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(reference)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(reference.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            {reference.recommendation && (
              <CardContent>
                <p className="text-muted-foreground italic">"{reference.recommendation}"</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReferencesManager;