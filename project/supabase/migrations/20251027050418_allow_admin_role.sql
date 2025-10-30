/*
  # Allow Admin Role in Profiles

  ## Changes
  - Update profiles role constraint to include 'admin'

  ## Security
  - Maintains existing RLS policies
*/

-- Update the role check constraint to allow admin role
DO $$
BEGIN
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('entrepreneur', 'investor', 'dealer', 'admin'));
END $$;