DO $$
BEGIN
    -- Check if the 'role' column exists in the 'profiles' table
    IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'public.profiles'::regclass AND attname = 'role' AND NOT attisdropped) THEN
        -- Add the role column, allowing NULLs for now
        ALTER TABLE public.profiles ADD COLUMN role text;

        -- Add the check constraint to ensure the role is one of the allowed values
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('customer', 'chef', 'rider'));

        -- Update existing rows to have a default role of 'customer'
        -- This is necessary before adding the NOT NULL constraint
        UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;

        -- Add the NOT NULL constraint to the role column
        ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;
    END IF;
END $$;
