
-- Create zones table
CREATE TABLE public.zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '🌿',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  facts JSONB NOT NULL DEFAULT '[]',
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;

-- Create app_role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Zones RLS policies
CREATE POLICY "Anyone can view zones" ON public.zones
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert zones" ON public.zones
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update zones" ON public.zones
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete zones" ON public.zones
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- User roles RLS policies
CREATE POLICY "Admins can view roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_zones_updated_at
  BEFORE UPDATE ON public.zones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for zone images
INSERT INTO storage.buckets (id, name, public) VALUES ('zone-images', 'zone-images', true);

CREATE POLICY "Zone images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'zone-images');

CREATE POLICY "Admins can upload zone images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'zone-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update zone images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'zone-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete zone images" ON storage.objects
  FOR DELETE USING (bucket_id = 'zone-images' AND public.has_role(auth.uid(), 'admin'));
