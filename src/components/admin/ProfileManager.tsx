import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/ui/file-upload";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

const ProfileManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileInsert>>({});

  // ✅ Just fetch profile here (no JSX inside useEffect)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      setProfile(data);
      setFormData(data || {});
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const dataToSave = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (profile) {
        const { error } = await supabase
          .from("profiles")
          .update(dataToSave)
          .eq("id", profile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("profiles").insert([dataToSave]);
        if (error) throw error;
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile saved successfully",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Profile Picture</label>
            <FileUpload
              bucket="profile-images"
              value={formData.profile_image_url || ""}
              onUpload={(url) =>
                setFormData((prev) => ({ ...prev, profile_image_url: url }))
              }
              disabled={!isEditing}
              accept="image/*"
            />
            {formData.profile_image_url && (
              <img
                src={formData.profile_image_url}
                alt="Profile Preview"
                className="h-32 w-32 rounded-full object-cover border mx-auto"
              />
            )}
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={formData.full_name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, full_name: e.target.value }))
              }
              disabled={!isEditing}
            />
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              disabled={!isEditing}
            />
            <label className="text-sm font-medium">Location</label>
            <Input
              value={formData.location || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              disabled={!isEditing}
            />
            <label className="text-sm font-medium">Email</label>
            <Input
              value={formData.email || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={!isEditing}
            />
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              disabled={!isEditing}
            />
            <label className="text-sm font-medium">LinkedIn URL</label>
            <Input
              value={formData.linkedin_url || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  linkedin_url: e.target.value,
                }))
              }
              disabled={!isEditing}
            />
            <label className="text-sm font-medium">GitHub URL</label>
            <Input
              value={formData.github_url || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, github_url: e.target.value }))
              }
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={formData.bio || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={7}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profile || {});
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileManager;
