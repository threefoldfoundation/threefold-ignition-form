-- Fix RLS policy issue for ThreeFold_data table
-- Add basic admin-only policies to secure the table

-- Add SELECT policy for ThreeFold_data (admin only)
CREATE POLICY "Only admins can view ThreeFold data" 
ON public."ThreeFold_data" 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Add INSERT policy for ThreeFold_data (admin only)
CREATE POLICY "Only admins can insert ThreeFold data" 
ON public."ThreeFold_data" 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

-- Add UPDATE policy for ThreeFold_data (admin only)
CREATE POLICY "Only admins can update ThreeFold data" 
ON public."ThreeFold_data" 
FOR UPDATE 
TO authenticated
USING (public.is_admin());

-- Add DELETE policy for ThreeFold_data (admin only)
CREATE POLICY "Only admins can delete ThreeFold data" 
ON public."ThreeFold_data" 
FOR DELETE 
TO authenticated
USING (public.is_admin());