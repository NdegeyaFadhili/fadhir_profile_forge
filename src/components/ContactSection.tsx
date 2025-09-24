import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email, phone, location, linkedin_url, github_url')
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error fetching profile:', error);
          return;
        }

        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  return (
    <section id="contact" className="py-16 bg-muted/50">
      <div className="container mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3 text-muted-foreground">
                {profile?.email && (
                  <p className="flex items-center gap-3">
                    <span className="font-medium">Email:</span> 
                    <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
                      {profile.email}
                    </a>
                  </p>
                )}
                {profile?.phone && (
                  <p className="flex items-center gap-3">
                    <span className="font-medium">Phone:</span> 
                    <a href={`tel:${profile.phone}`} className="text-primary hover:underline">
                      {profile.phone}
                    </a>
                  </p>
                )}
                {profile?.location && (
                  <p className="flex items-center gap-3">
                    <span className="font-medium">Location:</span> {profile.location}
                  </p>
                )}
                {profile?.linkedin_url && (
                  <p className="flex items-center gap-3">
                    <span className="font-medium">LinkedIn:</span> 
                    <a 
                      href={profile.linkedin_url.startsWith('http') ? profile.linkedin_url : `https://${profile.linkedin_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      {profile.linkedin_url.replace(/^https?:\/\//, '')}
                    </a>
                  </p>
                )}
                {profile?.github_url && (
                  <p className="flex items-center gap-3">
                    <span className="font-medium">GitHub:</span> 
                    <a 
                      href={profile.github_url.startsWith('http') ? profile.github_url : `https://${profile.github_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      {profile.github_url.replace(/^https?:\/\//, '')}
                    </a>
                  </p>
                )}
                {!profile?.email && !profile?.phone && !profile?.location && !profile?.linkedin_url && !profile?.github_url && (
                  <p className="text-muted-foreground italic">
                    Contact information will appear here once the owner adds their details.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Message subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-md font-medium"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;