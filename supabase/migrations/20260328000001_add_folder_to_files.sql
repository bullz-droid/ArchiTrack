-- Add folder column to files table
ALTER TABLE files ADD COLUMN folder TEXT DEFAULT 'General';
