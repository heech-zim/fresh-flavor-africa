
-- 1. Drop the permissive INSERT policy on user_roles that allows self-promotion
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;

-- 2. Create a secure RPC that only allows assigning the 'farmer' role
CREATE OR REPLACE FUNCTION public.assign_farmer_role()
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'farmer')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- 3. Revoke execute on create_admin_user from all roles
REVOKE EXECUTE ON FUNCTION public.create_admin_user(text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_admin_user(text, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.create_admin_user(text, text) FROM anon;

-- 4. Add defense-in-depth admin check inside create_admin_user
CREATE OR REPLACE FUNCTION public.create_admin_user(user_email text, user_password text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  new_user_id uuid;
BEGIN
  -- Defense-in-depth: only admins can create admin users
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: only admins can create admin users';
  END IF;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_sent_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
    'authenticated', 'authenticated', user_email,
    crypt(user_password, gen_salt('bf')),
    now(), now(), now(), now(),
    '{"provider": "email", "providers": ["email"]}', '{}'
  ) RETURNING id INTO new_user_id;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin'::app_role);

  RETURN new_user_id;
END;
$function$;
