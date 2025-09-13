import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Certificate = Database['public']['Tables']['certificates']['Row'];
type CertificateInsert = Database['public']['Tables']['certificates']['Insert'];

const CertificatesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState<Partial<CertificateInsert>>({});

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate required fields
    if (!formData.title || !formData.issuer) {
      toast({
        title: "Error",
        description: "Title and Issuer are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
        title: formData.title,
        issuer: formData.issuer,
      };

      if (editingCertificate) {
        const { error } = await supabase
          .from('certificates')
          .update(dataToSave)
          .eq('id', editingCertificate.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('certificates')
          .insert([dataToSave]);
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Certificate ${editingCertificate ? 'updated' : 'created'} successfully`,
      });
      
      setIsDialogOpen(false);
      setEditingCertificate(null);
      setFormData({});
      fetchCertificates();
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast({
        title: "Error",
        description: "Failed to save certificate",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setFormData(certificate);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Certificate deleted successfully",
      });
      
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast({
        title: "Error",
        description: "Failed to delete certificate",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof CertificateInsert, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (date: string | null): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Certificates</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCertificate(null);
              setFormData({});
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Issuer</label>
                  <Input
                    value={formData.issuer || ''}
                    onChange={(e) => handleInputChange('issuer', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Issue Date</label>
                  <Input
                    type="date"
                    value={formData.issue_date || ''}
                    onChange={(e) => handleInputChange('issue_date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Expiry Date</label>
                  <Input
                    type="date"
                    value={formData.expiry_date || ''}
                    onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Credential ID</label>
                <Input
                  value={formData.credential_id || ''}
                  onChange={(e) => handleInputChange('credential_id', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={formData.image_url || ''}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Credential URL</label>
                <Input
                  value={formData.credential_url || ''}
                  onChange={(e) => handleInputChange('credential_url', e.target.value)}
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
        {certificates.map((certificate) => (
          <Card key={certificate.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {certificate.image_url && (
                    <img 
                      src={certificate.image_url} 
                      alt={certificate.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <div>{certificate.title}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {certificate.issuer}
                    </div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {formatDate(certificate.issue_date)}
                      {certificate.expiry_date && ` - ${formatDate(certificate.expiry_date)}`}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {certificate.credential_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={certificate.credential_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(certificate)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(certificate.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            {certificate.credential_id && (
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Credential ID: {certificate.credential_id}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CertificatesManager;