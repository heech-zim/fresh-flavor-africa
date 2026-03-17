-- Fix existing test user data
INSERT INTO public.user_roles (user_id, role) VALUES ('d9b71233-56ce-4887-a6f7-91610e488189', 'farmer') ON CONFLICT (user_id, role) DO NOTHING;