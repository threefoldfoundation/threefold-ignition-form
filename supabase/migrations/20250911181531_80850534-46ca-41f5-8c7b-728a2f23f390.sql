-- Fix security vulnerability: Restrict access to user_responses table
-- Only allow authorized users (admins) to read survey responses

-- Create a function to check if user is an admin (you can modify this logic as needed)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- For now, we'll restrict to service role only
  -- You can modify this later to check against a roles table
  SELECT auth.role() = 'service_role';
$$;

-- Add SELECT policy to restrict read access to admins only
CREATE POLICY "Only admins can view survey responses" 
ON public.user_responses 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Add UPDATE policy (admins only)
CREATE POLICY "Only admins can update survey responses" 
ON public.user_responses 
FOR UPDATE 
TO authenticated
USING (public.is_admin());

-- Add DELETE policy (admins only) 
CREATE POLICY "Only admins can delete survey responses" 
ON public.user_responses 
FOR DELETE 
TO authenticated
USING (public.is_admin());