
CREATE TABLE public.prompt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.prompt_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own history" ON public.prompt_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON public.prompt_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history" ON public.prompt_history
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
