-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'voter');

-- Create candidates table
CREATE TABLE public.candidates (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    party TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create voters (profiles) table
CREATE TABLE public.voters (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    voted_status BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create votes (transaction_log) table
CREATE TABLE public.votes (
    id BIGSERIAL PRIMARY KEY,
    voter_id UUID NOT NULL REFERENCES public.voters(id) ON DELETE CASCADE,
    candidate_id BIGINT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(voter_id, candidate_id)
);

-- Create user_roles table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for candidates table
CREATE POLICY "Candidates are viewable by everyone"
ON public.candidates FOR SELECT
USING (true);

CREATE POLICY "Admins can insert candidates"
ON public.candidates FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can update candidates"
ON public.candidates FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Only super_admin can delete candidates"
ON public.candidates FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for voters table
CREATE POLICY "Users can view their own voter profile"
ON public.voters FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can view all voter profiles"
ON public.voters FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can insert their own voter profile"
ON public.voters FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own voter profile"
ON public.voters FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- RLS Policies for votes table
CREATE POLICY "Users can view their own votes"
ON public.votes FOR SELECT
TO authenticated
USING (voter_id = auth.uid());

CREATE POLICY "Admins can view all votes"
ON public.votes FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Authenticated users can cast votes"
ON public.votes FOR INSERT
TO authenticated
WITH CHECK (voter_id = auth.uid());

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create voter profile
    INSERT INTO public.voters (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    
    -- Assign default 'voter' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'voter');
    
    RETURN NEW;
END;
$$;

-- Trigger to auto-create profile and role on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for voters updated_at
CREATE TRIGGER update_voters_updated_at
    BEFORE UPDATE ON public.voters
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment candidate votes and mark voter as voted
CREATE OR REPLACE FUNCTION public.cast_vote(p_candidate_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_voter_id UUID;
    v_has_voted BOOLEAN;
BEGIN
    v_voter_id := auth.uid();
    
    -- Check if voter exists and hasn't voted
    SELECT voted_status INTO v_has_voted
    FROM public.voters
    WHERE id = v_voter_id;
    
    IF v_has_voted IS NULL THEN
        RAISE EXCEPTION 'Voter profile not found';
    END IF;
    
    IF v_has_voted THEN
        RAISE EXCEPTION 'You have already voted';
    END IF;
    
    -- Insert vote record
    INSERT INTO public.votes (voter_id, candidate_id)
    VALUES (v_voter_id, p_candidate_id);
    
    -- Update candidate vote count
    UPDATE public.candidates
    SET votes = votes + 1
    WHERE id = p_candidate_id;
    
    -- Mark voter as voted
    UPDATE public.voters
    SET voted_status = true
    WHERE id = v_voter_id;
    
    RETURN true;
END;
$$;

-- Insert sample candidates
INSERT INTO public.candidates (name, party, photo_url) VALUES
('Narendra Modi', 'BJP', '/src/assets/narendra-modi.jpg'),
('Rahul Gandhi', 'INC', '/src/assets/rahul-gandhi.jpg'),
('Arvind Kejriwal', 'AAP', '/src/assets/arvind-kejriwal.jpg'),
('Amit Shah', 'BJP', '/src/assets/amit-shah.jpg');