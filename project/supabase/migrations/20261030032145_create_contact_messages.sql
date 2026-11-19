/*
# Create contact_messages table

1. New Tables
- `contact_messages`: visitor messages sent from the portfolio contact form.
  - id (uuid, primary key, auto-generated)
  - name, email, subject, message (text, required)
  - is_read (boolean, defaults to false, for later review)
  - created_at (timestamptz, defaults to now)
2. Security
- Row level security enabled.
- Anonymous and signed-in visitors may INSERT only.
- No SELECT, UPDATE or DELETE is granted to anon or authenticated, so messages are private.
3. Notes
- Reading messages is done from the Supabase dashboard (service role bypasses RLS).
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
