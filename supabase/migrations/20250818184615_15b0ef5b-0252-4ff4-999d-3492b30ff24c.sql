-- Fix the critical security vulnerability: Update has_role function to prevent search path attacks
-- and ensure proper RLS policy enforcement for contact_messages

-- 1. First, secure the has_role function by setting search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- 2. Fix other security definer functions to prevent search path attacks
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_admin_user(user_email text, user_password text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create user via Supabase auth (simulating signup)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}'
  ) RETURNING id INTO new_user_id;
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin'::app_role);
  
  RETURN new_user_id;
END;
$function$;

-- 3. Ensure RLS policies are properly restrictive for contact_messages
-- Drop and recreate the admin policy to ensure it's secure
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages" 
ON public.contact_messages 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Ensure the insert policy is properly scoped
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 5. Add explicit deny policy for unauthorized access attempts
CREATE POLICY "Deny all other operations on contact messages" 
ON public.contact_messages 
FOR ALL
TO anon, authenticated
USING (false);

-- 6. Apply the same security fixes to quote_requests table
DROP POLICY IF EXISTS "Admins can view quote requests" ON public.quote_requests;
CREATE POLICY "Admins can view quote requests" 
ON public.quote_requests 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can submit quote requests" ON public.quote_requests;
CREATE POLICY "Anyone can submit quote requests" 
ON public.quote_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Deny all other operations on quote requests" 
ON public.quote_requests 
FOR ALL
TO anon, authenticated
USING (false);