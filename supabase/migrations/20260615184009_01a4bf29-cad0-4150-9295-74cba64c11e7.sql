
-- Enums
CREATE TYPE public.disability_type AS ENUM ('none', 'wheelchair', 'visual', 'hearing', 'cognitive');
CREATE TYPE public.node_type AS ENUM ('building', 'elevator', 'ramp', 'intersection', 'gate', 'landmark');
CREATE TYPE public.app_language AS ENUM ('bn', 'en');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  disability_type public.disability_type NOT NULL DEFAULT 'none',
  voice_enabled BOOLEAN NOT NULL DEFAULT false,
  language public.app_language NOT NULL DEFAULT 'bn',
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Nodes
CREATE TABLE public.nodes (
  id TEXT PRIMARY KEY,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  type public.node_type NOT NULL,
  x DOUBLE PRECISION NOT NULL,
  y DOUBLE PRECISION NOT NULL,
  accessible BOOLEAN NOT NULL DEFAULT true,
  notes_bn TEXT,
  notes_en TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.nodes TO authenticated;
GRANT SELECT ON public.nodes TO anon;
GRANT ALL ON public.nodes TO service_role;
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read nodes" ON public.nodes FOR SELECT TO anon, authenticated USING (true);

-- Edges
CREATE TABLE public.edges (
  id BIGSERIAL PRIMARY KEY,
  from_node TEXT NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
  to_node TEXT NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
  distance DOUBLE PRECISION NOT NULL,
  has_stairs BOOLEAN NOT NULL DEFAULT false,
  has_ramp BOOLEAN NOT NULL DEFAULT false,
  has_elevator BOOLEAN NOT NULL DEFAULT false,
  is_accessible BOOLEAN NOT NULL DEFAULT true,
  surface TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.edges TO authenticated;
GRANT SELECT ON public.edges TO anon;
GRANT ALL ON public.edges TO service_role;
ALTER TABLE public.edges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read edges" ON public.edges FOR SELECT TO anon, authenticated USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
