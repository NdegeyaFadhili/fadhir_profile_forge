-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('certificate-images', 'certificate-images', true);

-- Create storage policies for profile images
CREATE POLICY "Profile images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for project images
CREATE POLICY "Project images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-images');

CREATE POLICY "Users can upload their own project images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own project images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for certificate images
CREATE POLICY "Certificate images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'certificate-images');

CREATE POLICY "Users can upload their own certificate images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'certificate-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own certificate images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'certificate-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own certificate images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'certificate-images' AND auth.uid()::text = (storage.foldername(name))[1]);